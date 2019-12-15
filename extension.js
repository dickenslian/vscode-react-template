// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;

const ComponentType = {
    FUNCTIONAL_COMP: 1,
    PURE_COMP: 2,
    TS_PURE_COMP: 3,
}

function generateClassName(dirName) {
    if (!dirName) {
        throw new Error('dir name should not be null');
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const nameUnderlineArr = dirName.split('_');

    let stepOneClassName = '';
    
    for (const name of nameUnderlineArr) {
        stepOneClassName += capitalizeFirstLetter(name);
    }

    let stepTwoClassName = ''
    const nameCrossArr = stepOneClassName.split('-');
    
    for (const name of nameCrossArr) {
        stepTwoClassName += capitalizeFirstLetter(name);
    }

    return stepTwoClassName;
}

function generateComponent(componentName, fullPath, componentType) {
    if (fs.existsSync(fullPath)) {
        console.log(`${componentName} already exists, please choose another name.`);
        return;
    }

    const className = generateClassName(componentName);
    console.log(`class name: ${className}`);


    fs.mkdirSync(fullPath);

    const fcTemplate = path.resolve(__dirname, './file_template/fc.txt');
    const pcTemplate = path.resolve(__dirname, './file_template/pc.txt');
    const tsPcTemplate = path.resolve(__dirname, './file_template/tspc.txt');
    const sassTemplate = path.resolve(__dirname, './file_template/scss.scss');

    let jsFile = componentType === ComponentType.TS_PURE_COMP ? path.resolve(`${fullPath}/index.tsx`) : path.resolve(`${fullPath}/index.js`);
    const sassFile = path.resolve(`${fullPath}/index.scss`);


    fs.writeFileSync(sassFile, fs.readFileSync(sassTemplate, { encoding: 'utf-8' }));

    let jsFileContent;

    if (componentType === ComponentType.FUNCTIONAL_COMP) {
        jsFileContent = fs.readFileSync(fcTemplate, { encoding: 'utf-8' });
    } else if (componentType === ComponentType.PURE_COMP) {
        jsFileContent = fs.readFileSync(pcTemplate, { encoding: 'utf-8' });
    } else if (componentType === ComponentType.TS_PURE_COMP) {
        jsFileContent = fs.readFileSync(tsPcTemplate, { encoding: 'utf-8' });
    }

    fs.writeFileSync(jsFile, jsFileContent.replace(/ClassName/g, className));

    exec(`cd ${fullPath} && git add .`, (err) => {
        if (err) {
            console.log('command fail:', 'git add .');
        } else {
            console.log('command success:', 'git add .');
        }
    });

   vscode.window.showInformationMessage('component created successfully!');
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "react-template" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    const fc = vscode.commands.registerCommand('extension.createFunctionalComponent', function (param) {
        // The code you place here will be executed every time your command is executed

        // vscode.window.showInformationMessage(param.fsPath); 

        const folderPath = param.fsPath;

        const options = {
            prompt: "Please input the component name: ",
            placeHolder: "Component Name"
        }
        
        vscode.window.showInputBox(options).then(value => {
            if (!value) return;

            const componentName = value;
            const fullPath = `${folderPath}/${componentName}`;

            generateComponent(componentName, fullPath, ComponentType.FUNCTIONAL_COMP);
        });
    });

    const pc = vscode.commands.registerCommand('extension.createPureComponent', function (param) {
        // The code you place here will be executed every time your command is executed

        // vscode.window.showInformationMessage(param.fsPath); 

        const folderPath = param.fsPath;

        const options = {
            prompt: "Please input the component name: ",
            placeHolder: "Component Name"
        }
        
        vscode.window.showInputBox(options).then(value => {
            if (!value) return;

            const componentName = value;
            const fullPath = `${folderPath}/${componentName}`;

            generateComponent(componentName, fullPath, ComponentType.PURE_COMP);
        });
    });

    const tspc = vscode.commands.registerCommand('extension.createTsPureComponent', function (param) {
        // The code you place here will be executed every time your command is executed

        // vscode.window.showInformationMessage(param.fsPath); 

        const folderPath = param.fsPath;

        const options = {
            prompt: "Please input the component name: ",
            placeHolder: "Component Name"
        }
        
        vscode.window.showInputBox(options).then(value => {
            if (!value) return;

            const componentName = value;
            const fullPath = `${folderPath}/${componentName}`;

            generateComponent(componentName, fullPath, ComponentType.TS_PURE_COMP);
        });
    });

    context.subscriptions.push(fc);
    context.subscriptions.push(pc);
    context.subscriptions.push(tspc);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;