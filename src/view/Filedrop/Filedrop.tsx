import './Filedrop.css';
import * as React from 'react';
import { observer } from 'mobx-react';
import { IEditorAppState } from '../../model/IEditorAppState';
import { IObservableObject } from 'mobx';
import { EditorWorld } from '../../3d/World/EditorWorld';
import { readFile } from 'fs';
import { readFileAsText } from '../../tools/readFileAsText';

interface IFiledropProps<T> {
    onJsonFile: (json: T) => void; //todo is this good solution?
}

export function Filedrop<T>({ onJsonFile }: IFiledropProps<T>) {
    return (
        <div
            className="Filedrop"
            ref={(element) => {
                if (element) {
                    //console.log(`Setting up Filedrop listeners.`);

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
                            //console.log(`dragover`, event);
                            element.classList.add('drag');
                        },
                        false,
                    );

                    element.addEventListener(
                        'dragover',
                        (event) => {
                            event.preventDefault();
                            //console.log(`dragover`, event);
                        },
                        false,
                    );

                    element.addEventListener(
                        'dragenter',
                        (event) => {
                            event.preventDefault();
                            //console.log(`dragenter`, event);
                            element.classList.add('drag');
                        },
                        false,
                    );

                    element.addEventListener(
                        'dragleave',
                        (event) => {
                            event.preventDefault();
                            //console.log(`dragleave`, event);

                            element.classList.remove('drag');
                        },
                        false,
                    );

                    element.addEventListener(
                        'drop',
                        async (event) => {
                            event.preventDefault();
                            //console.log(`drop`, event);

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

                                const importedJSON = JSON.parse(
                                    await readFileAsText(file),
                                ) as T;

                                onJsonFile(importedJSON);
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
}
