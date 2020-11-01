const fs = require('fs');
const readline = require('readline');

class Trie {
    constructor () {
        this.children = { };
        this.terminal = 0;
    }

    insert(word) {
        let firstChar = word.slice(0,1);
        let node = null;
        if(firstChar in this.children) {
            node = this.children[firstChar];
        }
        else {
            node = new Trie();
            this.children[firstChar] = node;
        }
        if(word.length === 1) {
            node.makeTerminal();
        }
        else {
            node.insert(word.slice(1,word.length));
        }
    }

    makeTerminal() {
        this.terminal = 1;
    }

    isTerminal() {
        return this.terminal;
        let node = this.children[firstChar];
    }

    lookup(word) {
        let firstChar = word.slice(0,1);
        if(!(firstChar in this.children)) {
            return 0;
        }
        let node = this.children[firstChar];
        if(word.length === 1) {
            return node.isTerminal();
        }
        return node.lookup(word.slice(1,word.length));
    }

    print() {
        this.printStep("");
    };

    printStep(prefix) {
        if(this.isTerminal()) {
            console.log(prefix);
        }
        let keys = Object.keys(this.children);
        for(let i=0; i<keys.length; i++) {
            let nextKey = keys[i];
            let node = this.children[nextKey];
            let nextPrefix = prefix + nextKey;
            node.printStep(nextPrefix);
        }
    }

    spellingBee(requiredLetter, allowedLetters) {
        let keys = allowedLetters.split('');
        keys.push(requiredLetter);
        keys.sort();
        this.spellingBeeStep("",requiredLetter, keys);
    }

    spellingBeeStep(prefix, requiredLetter, keys) {
        // console.log("Checking: " + prefix);
        if(this.isTerminal() && (prefix.length > 3) && prefix.includes(requiredLetter)) {
            console.log(prefix);
        }
        for(let i=0; i<keys.length; i++) {
            let key = keys[i];
            if(key in this.children) {
                let newPrefix = prefix + key;
                this.children[key].spellingBeeStep(newPrefix,requiredLetter,keys);
            }
        }
    }

    read(path) {
        const rl = readline.createInterface({
            input: fs.createReadStream(path)
        });
        let trie = this;
        let resolve; 
        const p = new Promise( _resolve => resolve = _resolve ); 
        rl.on( 'close', () => resolve() );
        rl.on('line', function(line) {
            trie.insert(line);
        });
        return p; 
    }
}

if(process.argv.length != 4 ) {
    console.log("usage: node spelling-bee.js <required letter> <allowed letters>");
    process.exit(1);
}
let requiredLetter = process.argv[2];
let allowedLetters = process.argv[3];

let trie = new Trie();
const path = "dict.aspell.txt";
trie.read(path).then( () => {
            trie.spellingBee(requiredLetter,allowedLetters);
        });
