export class View {

    svg;

    constructor(
        generateSvg,
        referenceHandle,
        referenceType
    ) {
        container = getElement(referenceHandle, referenceType);
    }
}

function getElement() {
    
}