import { createSession, createViewport, MaterialStandardData, VISIBILITY_MODE } from '@shapediver/viewer' 
import { useEffect, useRef, useState} from 'react'
import { InteractionData, InteractionEngine, SelectManager, HoverManager } from '@shapediver/viewer.features.interaction'
import { addListener, removeListener, EVENTTYPE_INTERACTION } from '@shapediver/viewer'

const ShapeDiverViewer = ({My_Ticket, My_Model_View_URL, parameterName}) => {
   
    const canvasRef = useRef(null)
    const initialized = useRef(false)
    const refs = useRef({})

    const [selected, setSelected] = useState(false)
    const [heightValue, setHeightValue] = useState(0)
    const [heightRange, setHeightRange] = useState({min:200, max: 2500, step:10})


    const initViewer = async () => {
        const viewport = await createViewport({
        id: 'shapediver-viewport',
        canvas: canvasRef.current,
        visibility: VISIBILITY_MODE.SESSION,
        branding: {
            logo: "/logo2.png",
            backgroundColor: "#efe5d3"
        }
        })

    
        const session = await createSession({
        id: 'shapediver-session',
        ticket: My_Ticket,
        modelViewUrl: My_Model_View_URL
        })





        
        const interactionEngine = new InteractionEngine(viewport);

        const selectManager = new SelectManager()
        selectManager.effectMaterial = new MaterialStandardData({ color: "#976f00"})
        interactionEngine.addInteractionManager(selectManager);

        const hoverManager = new HoverManager()
        hoverManager.effectMaterial = new MaterialStandardData({color: "#eeff00"})
        interactionEngine.addInteractionManager(hoverManager)


        const tagForInteraction = (node) => {
            node.data.push(new InteractionData({ select: true, hover: true}))
            node.updateVersion()
        }

        const applyInteractionFlags = () => {
            for (let i = 0; i < session.node.children.length; i++){
                tagForInteraction(session.node.children[i])
            }
        }
        applyInteractionFlags()
        
        console.table(
            Object.values(session.outputs).map(o => ({
                id: o.id,
                name: o.name,
                displayname: o.displayname,
                hasNode: !!o.node,
                children: o.node?.children.length
            }))
        )
        

        const heightParameter = session.getParameterByName("Thickness z")[0]

        if (!heightParameter) {
            console.warn('Parameter "Total Height (tz)" not found on this model')
        } else {

            setHeightRange({
                min: Number(heightParameter.min),
                max: Number(heightParameter.max),
                step: heightParameter.step || 1
            })
            setHeightValue(Number(heightParameter.value))
        }

        
        const output = session.getOutputByName("boxes")
        //const output = Object.values(session.outputs)[0]
        if (output){
            output.updateCallback = () => applyInteractionFlags()
        }


        const selectOnToken = addListener(EVENTTYPE_INTERACTION.SELECT_ON, (e) => {
            console.log("selected:", e.node?.name)
            if (heightParameter) setHeightValue(Number(heightParameter.value))
            setSelected(true)
        })

        const selectOffToken = addListener(EVENTTYPE_INTERACTION.SELECT_OFF, () => {
            setSelected(false)
        })

        

        refs.current = {
            viewport,
            session,
            interactionEngine,
            selectOnToken,
            selectOffToken,
            heightParameter,
            debounceTimer: null
        }
    }

    const onHeightChange = (e) => {
        const value = Number(e.target.value)
        setHeightValue(value)

        const {session, heightParameter} = refs.current
        if (!heightParameter) return

        let next = value
        if (heightParameter.decimalplaces === 0) next = Math.round(next)
        heightParameter.value = next

        clearTimeout(refs.current.debounceTimer)
        refs.current.debounceTimer = setTimeout(()=> {
            if (heightParameter.isValid(heightParameter.value)) session.customize()
        }, 200)
    }


    
    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;
        initViewer();

        return () => {
            const { 
                interactionEngine, session, viewport, 
                selectOnToken, selectOffToken, onPointerMove, 
                debounceTimer
            } = refs.current;
            
            clearTimeout(debounceTimer)
            if (onPointerMove) canvasRef.current?.removeEventListener('pointermove', onPointerMove)
            if (selectOnToken) removeListener(selectOnToken)
            if (selectOffToken) removeListener(selectOffToken)

            interactionEngine?.close?.();
            session?.close?.();
            viewport?.close?.();
        }
    }, [])

    return (
        <div className="relative w-full h-full min-h-[500px] rounded-md overflow-hidden">
            <canvas
                ref={canvasRef}
                className="w-full h-full border-0"
                title="ShapeDiver Model"
            />

            {selected && (
                <div className='absolute top-4 right-4 bg-white/90 backdrop-blur p-4 rounded-md shadow-lg w-64'>
                <label className="block text-sm font-medium mb-2">Total Height (tz)</label>
                <input
                    type="range"
                    min={heightRange.min}
                    max={heightRange.max}
                    step={heightRange.step}
                    value={heightValue}
                    onChange={onHeightChange}
                    className="w-full"
                />
             <div className="text-sm text-gray-600 mt-1">{heightValue}</div>
         </div>
        )}
    </div>
    )
}


export default ShapeDiverViewer