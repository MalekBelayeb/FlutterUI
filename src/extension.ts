// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { getWebViewContent } from './Utils/ViewUtils'; 

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	context.subscriptions.push(

		vscode.commands.registerCommand('flutteruikit.helloWorld', () => {
		
			vscode.window.showInformationMessage('Hello World from FlutterUIKit!');
		
		})

	);

	context.subscriptions.push(

		vscode.commands.registerCommand('flutteruikit.runFlutterUIKit', () => {

			const panel = vscode.window.createWebviewPanel(
				'FlutterUIKitView', 
				'Flutter UIKit', 
				vscode.ViewColumn.One, 
				{
					
					enableCommandUris: true,
					enableForms:true,
					enableFindWidget:true,
					enableScripts: true,
					
				});	

				panel.webview.html = getWebViewContent("FlutterUIKit.html").injectResources(panel.webview,context,["FlutterUIKit.css"],["FlutterUIKit.js"]);
				
				})
			
	);


}

// this method is called when your extension is deactivated
export function deactivate() { }
