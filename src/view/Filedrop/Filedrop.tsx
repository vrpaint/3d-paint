import './Filedrop.css';
import * as React from 'react';
import { observer } from 'mobx-react';
import { IEditorAppState } from '../../model/IEditorAppState';
import { IObservableObject } from 'mobx';
import { World } from '../../3d/World/World';
import { readFile } from 'fs';
import { readFileAsText } from '../../tools/readFileAsText';

interface IMenuProps {
    appState: IEditorAppState & IObservableObject;
    world: World;
}

export const Filedrop = observer(({ appState, world }: IMenuProps) => {
    return (
        <div
            className="Filedrop"
            ref={(element) => {
                if (element) {
                    console.log(`Setting up Filedrop listeners.`);

                    /*element.addEventListener("drag", ( event )=>{
                    event.preventDefault();
                    console.log(`drag`,event);
                }, false);*/

                    /*document.addEventListener("dragstart", ( event )=> {
                    event.preventDefault();
                    console.log(`dragstart`,event);
                    element.classList.add('drag');
                }, false);
              
                document.addEventListener("dragend", ( event ) =>{
                    event.preventDefault();
                    console.log(`dragend`,event);
                    element.classList.remove('drag');
                }, false);
                */

                    document.addEventListener(
                        'dragover',
                        (event) => {
                            event.preventDefault();
                            console.log(`dragover`, event);
                            element.classList.add('drag');
                        },
                        false,
                    );

                    element.addEventListener(
                        'dragover',
                        (event) => {
                            event.preventDefault();
                            console.log(`dragover`, event);
                        },
                        false,
                    );

                    element.addEventListener(
                        'dragenter',
                        (event) => {
                            event.preventDefault();
                            console.log(`dragenter`, event);
                            element.classList.add('drag');
                        },
                        false,
                    );

                    element.addEventListener(
                        'dragleave',
                        (event) => {
                            event.preventDefault();
                            console.log(`dragleave`, event);

                            element.classList.remove('drag');
                        },
                        false,
                    );

                    element.addEventListener(
                        'drop',
                        async (event) => {
                            event.preventDefault();
                            console.log(`drop`, event);

                            element.classList.remove('drag');

                            try {
                                if (!event.dataTransfer) {
                                    throw new Error(
                                        `You should transfere some data.`,
                                    );
                                }
                                if (event.dataTransfer.files.length !== 1) {
                                    throw new Error(
                                        `You should drop only one file.`,
                                    );
                                }
                                const file = event.dataTransfer.files[0];

                                /*if(file.name!=='text/json'){
                            throw new Error(`You should drop only "text/json" files not "${file}".`);
                
                        }*/

                                const importedAppState = JSON.parse(
                                    await readFileAsText(file),
                                ) as IEditorAppState;

                                if (
                                    confirm(
                                        `Do you want to replace "${
                                            appState.openedFile.name
                                        }" with "${importedAppState.openedFile.name}"`,
                                    )
                                ) {
                                    world.loadAppState(importedAppState);
                                }
                            } catch (error) {
                                alert(error);
                            }
                        },
                        false,
                    );
                }
            }}
        />
    );
});
