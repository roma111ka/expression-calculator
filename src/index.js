function eval() {
    // Do not use eval!!!
    return;
}
function expressionCalculator(expr) {
    const OP_TABLE = {
        '+': '1',
        '-': '1',
        '*': '2',
        '/': '2'
    };

    function method(a, b, operator) {
        if (operator === "/" && b === 0) {
            throw new Error("TypeError: Division by zero.")
        }
        return (operator === "+") ? a + b :
            (operator === "-") ? a - b :
            (operator === "*") ? a * b :
            (operator === "/") ? a / b : null;
    };

    let numStack = [];
    let opStack = [];
    let topNum, topOp;
    expr = expr.replace(/ /g, '');
    while (expr) {
        let token = expr[0];

        expr = !isNaN(+token) ?
            (
                numStack.push(parseInt(expr)),
                expr.slice(String(parseInt(expr)).length)
            ) : (
                expr.slice(1)
            );

        switch (token) {

            case '(':
                opStack.push(token);
                break;

            case ')':
                topOp = opStack.pop();
                while (topOp !== "(") {
                    topNum = numStack.pop();
                    numStack.push(method(numStack.pop(), topNum, topOp));
                    topOp = opStack.pop();
                    if (topOp === undefined) {
                        throw new Error("ExpressionError: Brackets must be paired")
                    }
                }
                break;

            case '+':
            case '-':
                topOp = opStack.pop();
                while (topOp !== "(" && topOp !== undefined) {
                    topNum = numStack.pop();
                    numStack.push(method(numStack.pop(), topNum, topOp));
                    topOp = opStack.pop();
                }
                opStack.push(topOp);
                opStack.push(token);
                break;
            case '*':
            case '/':
                topOp = opStack.pop();
                while (OP_TABLE[topOp] === "2") {
                    topNum = numStack.pop();
                    numStack.push(method(numStack.pop(), topNum, topOp));
                    topOp = opStack.pop();
                }
                opStack.push(topOp);
                opStack.push(token);
                break;
        }
    }

    while (numStack.length - 1) {

        topNum = numStack.pop();
        topOp = opStack.pop();
        numStack.push(method(numStack.pop(), topNum, topOp));
    }
    if (opStack.includes("(")) {
        throw new Error("ExpressionError: Brackets must be paired");
    } else return numStack[0]
}
module.exports = {
    expressionCalculator
}