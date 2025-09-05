window.addEventListener("message", (e) => {
    if (e.data.type === "dblclicked") {
        const mainCard = document.querySelector(".maincard");
        if(mainCard==e.source.frameElement) return;
        const tmpsrc = mainCard.src;
        mainCard.src = e.source.frameElement.src ;
        e.source.frameElement.src = tmpsrc;
    }
})
