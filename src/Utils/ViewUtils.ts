
import exp = require('constants');
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

export function getWebViewContent(filename: string):String {

    let globalPath = path.join(__dirname, '../../src/');

    return fs.readFileSync(globalPath + 'Views/' + filename, 'utf8').toString();

}

//Extension method
declare global{
    interface String {
        injectResources(webview: vscode.Webview, context: vscode.ExtensionContext, styles: any, scripts: any): string;
    }    
}

String.prototype.injectResources = function (webview: vscode.Webview, context: vscode.ExtensionContext, styles: any = [], scripts: any = []): string{

    var scriptSection = "";
    var styleSection = "";

    styles.forEach(element => {

        let styleUri = webview.asWebviewUri(vscode.Uri.joinPath(
            context.extensionUri, 'src', 'Views','css', element));
        styleSection += "<link rel='stylesheet' href = " + styleUri + ">";
            
    });

    scripts.forEach(element => {
        let scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(
            context.extensionUri, 'src', 'Views','js', element.name));
        scriptSection += " <script "+(element.isModule ? "type='module'" : "type='text/javascript'")+" src = " + scriptUri + " /> ";
    });
    
    return this.replace('${style_section}', styleSection.toString()).replace('${script_section}', scriptSection.toString());
}

