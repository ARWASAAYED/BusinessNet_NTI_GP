// Simple in-memory queue to replace Redis list operations
const queue = [];

module.exports = {
    push: (item) => {
        queue.push(item);
    },
    pop: () => {
        return queue.shift();
    },
    size: () => {
        return queue.length;
    },
    peek: () => {
        return queue[0];
    }
};
