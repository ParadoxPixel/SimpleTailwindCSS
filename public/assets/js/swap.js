class Swap {

    constructor(element) {
        this.container = element
        this.children = element.querySelectorAll('.swappable')

        setupElements(element, this.children)
    }

}

function setupElements(container, children) {
    let dropPosition;
    children.forEach(child => {
        child.setAttribute('draggable', true)
        child.addEventListener('dragstart', () => {
            child.classList.add('swapping')
        })

        child.addEventListener('dragend', () => {
            child.classList.remove('swapping')
            if(!dropPosition)
                return

            dropPosition.classList.remove('swap-hover')
            swapNodes(child, dropPosition)
        })
    })

    container.addEventListener('dragover', e => {
        e.preventDefault()

        let old = dropPosition;
        dropPosition = getDragAfterElement(container, children, e.clientX, e.clientY)
        if(!dropPosition) {
            if(old)
                old.classList.remove('swap-hover')

            return
        }

        if(dropPosition.isSameNode(old))
            return;

        if(old)
            old.classList.remove('swap-hover')

        dropPosition.classList.add('swap-hover')
    })
}

function getDragAfterElement(container, children, x, y) {
    return [...children].find(e => {
        if(e.classList.contains('swapping'))
            return false

        const box = e.getBoundingClientRect()
        return box.top <= y && box.bottom >= y && box.left <= x && box.right >= x;
    })
}

function swapNodes(n1, n2) {

    let i;
    const p1 = n1.parentNode;
    const p2 = n2.parentNode;
    let i1, i2;

    if ( !p1 || !p2 || p1.isEqualNode(n2) || p2.isEqualNode(n1) ) return;

    for (i = 0; i < p1.children.length; i++) {
        if (p1.children[i].isEqualNode(n1)) {
            i1 = i;
        }
    }
    for (i = 0; i < p2.children.length; i++) {
        if (p2.children[i].isEqualNode(n2)) {
            i2 = i;
        }
    }

    if ( p1.isEqualNode(p2) && i1 < i2 ) {
        i2++;
    }
    p1.insertBefore(n2, p1.children[i1]);
    p2.insertBefore(n1, p2.children[i2]);
}

const container = document.getElementById("swap-container")
new Swap(container)