class Node {
    value: string[];
    next: NodeType | null;

    constructor(value: string[], next: NodeType | null = null) {
        this.value = value;
        this.next = next;
    }
}


type NodeType = {
    value: string[],
    next: NodeType | null
}


class LinkedList {
    head: NodeType | null;
    size: number;

    constructor() {
        this.head = null;
        this.size = 0;
    }

    // Adds node to the front of the linked-list
    addFirstHead(data: any) {
        this.head = new Node(data, this.head);
        this.size++;
    }

    // Adds node to the end of the linked-list
    insertLastNode(data: any) {
        let node = new Node(data, null);
        let current;

        if (!this.head) {
            this.addFirstHead(data);
        } else {
            current = this.head;
            while (current.next) {
                current = current.next;
            }
            current.next = node;
        }

        this.size++;
    }

    // Inserts node at specified index
    insertAt(data: any, index: number) {
        if (index < 0 && index > this.size) {
            return;
        }

        if (index == 0) {
            this.addFirstHead(data);
            return;
        }
        
        if (this.head && index <= this.size) {
            let node = new Node(data);

            var current: NodeType | null = this.head;
            if (current != null) {
                let previous;
                for (var i = 0; i < index; i++) {
                    previous = current;
                    if (current != null) {
                        current = current.next;
                    } else {
                        break
                    }
                    
                }
    
                node.next = current;
                if (previous != null) {
                    previous.next = node;
                }
                
                
                this.size++;
            }

            
        }
        

        
    }

    // Displays contents of linked list
    printList() {
        if (this.head != null) {
            var current = this.head;
            while (current.next != null) {
                console.log(current.value);
                current = current.next;
            }
            console.log(current.value);

        } else {
            console.log(null);
        }
    }

    valueAt(index: number) {
        let current = this.head;
        if (current != null) {
            for (var i = 0; i < index; i++) {
                if (current != null) {
                    current = current.next;
                } else {
                    break
                }
                
            }

            return current;
        } else {
            return null
        }
    }

    changeValue(index: number, value: string[]) {
        let current = this.head;
        if (current != null) {
            for (var i = 0; i < index; i++) {
                if (current != null) {
                    current = current.next;
                } else {
                    break
                }
                
            }

            if (current != null) {
                current.value = value;
            }
            
        }
    }
}

export default LinkedList;