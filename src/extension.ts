// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { getWebViewContent } from './Utils/ViewUtils';
import { createProject, synchronizeProject } from './Utils/ProjectManager';

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

			/*let uri = vscode.Uri.file('E:/flutter');
			vscode.commands.executeCommand('vscode.openFolder', uri,{forceNewWindow:false}).then(()=>{
			});*/

			const panel = vscode.window.createWebviewPanel(
				'FlutterUIKitView',
				'Flutter UIKit',
				vscode.ViewColumn.One,
				{

					enableCommandUris: true,
					enableForms: true,
					enableFindWidget: true,
					enableScripts: true,

				});


			panel.webview.onDidReceiveMessage(
				message => {

					switch (message.command) {

						case 'NEW_PROJECT':
							createProject(vscode, panel);
							return;

						case 'SYNCHRONIZE_PROJECT':
							synchronizeProject(message.projectPath, 'main.dart', message.content);
							return;
					}

				},
				undefined,
				context.subscriptions
			);

			panel.webview.html = getWebViewContent("flutterUIKit.html").injectResources(panel.webview, context, ["flutterUIKit.css"], [

				{ name: "flutterUIKit.js", isModule: true },

			]);

		})

	);


}



// this method is called when your extension is deactivated
export function deactivate() { }
