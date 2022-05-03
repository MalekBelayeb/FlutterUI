import * as cp from 'child_process';
import * as fs from 'fs';
import * as path from 'path';



export function createProject(vscode,panel)
{
	
	const options = {
		canSelectMany: false,
		canSelectFolders: true,
		openLabel: 'Open',
		filters: {
			'All files': ['*']
		}
	};

	vscode.window.showOpenDialog(options).then(folderUri => {
		
		if(folderUri)
		{
			if(folderUri.length > 0)
			{
				/*
				let terminal = vscode.window.createTerminal('Flutter Command Terminal');
				terminal.show;
				terminal.sendText( folderUri[0].fsPath.slice(0,2)+ " && cd " + folderUri[0].fsPath);
				*/
				let projectName = "fukit_project"
				let folderPath = folderUri[0].fsPath

				let command = folderPath.slice(0,2)+ " && cd " + folderPath + " && flutter create " + projectName
				
				cp.exec(command, {cwd: vscode.workspace.rootPath, env: process.env}, (e, stdout) => {
					if (e) {

					   vscode.window.showErrorMessage(e.message);

					} else {

						vscode.window.showInformationMessage(projectName + " Successfully created");

						vscode.commands.executeCommand("vscode.openFolder", vscode.Uri.file(folderPath),{forceNewWindow :true}).then(()=>{

						})
							
						panel.webview.postMessage({command:'ON_PROJECT_CREATED', name: projectName, path: folderPath +"\\"+ projectName });

					}
				  });

			}
		}
		

	});

}


export function synchronizeProject(projectPath,fileName,content)
{
    let filePath = projectPath + '/lib/'+fileName;
    
    fs.writeFile(filePath, content, 'utf8', function (err) {
        if (err) return console.log(err);
    });
    
}