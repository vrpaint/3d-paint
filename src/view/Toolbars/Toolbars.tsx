import './Toolbars.css';
import * as React from 'react';
import { observer } from 'mobx-react';
import { World } from '../../3d/World/World';

interface IToolbarsProps {
    world: World;
}

interface IToolbarsState {
    version: number;
}

export const Toolbars = observer(
    class Welcome extends React.Component<IToolbarsProps, IToolbarsState> {
        constructor(props: IToolbarsProps) {
            super(props);
            this.state = { version: 0 };

            setInterval(() => {
                this.newVersion();
            }, 1000);
        }

        newVersion() {
            this.setState({
                version: this.state.version + 1,
            });
        }

        render() {
            return (
                <div className="Toolbars">
                    {this.props.world.drawingTools.map(
                        (drawingTool, drawingToolIterator) => (
                            <div
                                draggable
                                className="Toolbar"
                                key={drawingToolIterator}
                                onClick={() => this.newVersion()}
                            >
                                {drawingTool.renderToolbar()}
                            </div>
                        ),
                    )}
                </div>
            );
        }
    },
);

/*
todo
import { useState } from 'react';

function Example() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
*/
