import { useEffect, useRef, useState } from "react";
import { connectAppBuilderCheckout } from "../lib/appBuilderCheckout";

const ShapeDiverAppIframe = ({src, onLoad, checkout}) => {
    const iframeRef = useRef(null)
    const [loaded, setLoaded] = useState(false)

    // Let the App Builder "Add to cart" button start a Stripe checkout
    useEffect(() => {
        if (!checkout || !loaded) return
        return connectAppBuilderCheckout(iframeRef.current)
    }, [checkout, loaded])

    return (
    <div className="w-full h-full min-h-[500px] rounded-md overflow-hidden">
    <iframe
    ref={iframeRef}
    src={src}
    title="ShapeDiver App"
    onLoad={() => {
        setLoaded(true)
        onLoad?.()
    }}
    referrerPolicy="orgin"
    allowFullScreen
    className="w-full h-full border-0"
    style={{border: 0, overflow: "hidden"}}
    />
    </div>
    )
};

export default ShapeDiverAppIframe;
