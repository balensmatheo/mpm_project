import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Divider,
    TextField,
} from "@mui/material";
import {AddTask, Delete} from "@mui/icons-material";
import {useState} from "react";
import { useEffect, useRef } from 'react';
import vis from 'vis';

function MPM(props) {
    const graphRef = useRef(null);

    useEffect(() => {
        const nodes = props.tasks.map(task => ({
            id: task.id,
            label: `${task.label} (${task.duration})`,
            duration: task.duration,
        }));

        const edges = [];
        props.tasks.forEach(task => {
            task.dependencies.forEach(dependencyId => {
                edges.push({
                    from: dependencyId,
                    to: task.id,
                    arrows: 'to'
                });
            });
        });

        const data = {
            nodes: new vis.DataSet(nodes),
            edges: new vis.DataSet(edges),
        };

        const options = {
            autoResize: false,
            height: '400px',
            width: '100%',
            physics: {
                enabled: false,
            },
            edges: {
                arrows: {
                    to: {enabled: true, scaleFactor:1, type:'arrow'},
                }
            },
            nodes: {
                shape: 'box',
                margin: 10,
                widthConstraint: {
                    maximum: 200,
                },
                font: {
                    size: 14,
                },
            },
        };

        const network = new vis.Network(graphRef.current, data, options);
        network.fit();

        function handleDoubleClick(event) {
            const nodeId = event.nodes[0];
            if (nodeId === undefined) {
                return;
            }

            const {x: xPos, y: yPos} = event.pointer.canvas;
            network.storePositions();
            const position = network.getPositions([nodeId])[nodeId];
            network.addEdgeMode();
            network.moveTo({
                position: {x: position.x, y: position.y},
                offset: {x: xPos - position.x, y: yPos - position.y}
            });
        }

        network.on("doubleClick", handleDoubleClick);

        return () => {
            network.off("doubleClick", handleDoubleClick);
        };
    }, [props.tasks]);

    return <div ref={graphRef} style={{ height: '400px' }} />;
}

export default function Main() {

    const [tasks, setTasks] = useState([]);
    const [taskName, setTaskName] = useState('');
    const [taskDuration, setTaskDuration] = useState('');
    const [taskDependencies, setTaskDependencies] = useState('');

    function createCard(){
        const dependencies = taskDependencies.split(',').map(id => parseInt(id)).filter(id => !isNaN(id) && id > 0 && id <= tasks.length);
        const newTask = {
            id: tasks.length + 1,
            label: taskName,
            duration: taskDuration,
            dependencies: dependencies,
        };
        setTasks([...tasks, newTask]);
        setTaskName('');
        setTaskDuration('');
        setTaskDependencies('');
    }
    return (
        <Box>
            <Card sx={{pt: 2}}>
                <CardContent sx={{width: "100%", display: "flex", flexDirection: "row", justifyContent: "space-evenly"}}>
                    <TextField id="task-name" label="Nom de la tache" variant="outlined" value={taskName} onChange={(event) => setTaskName(event.target.value)} />
                    <TextField id="task-duration" type={"number"} label="Durée de la tache" variant="outlined" value={taskDuration} onChange={(event) => setTaskDuration(event.target.value)} />
                    <TextField id="task-dependencies" label="Prédécesseurs" variant="outlined" value={taskDependencies} onChange={(event) => setTaskDependencies(event.target.value)} />
                </CardContent>
                <Divider/>
                <CardActions sx={{display: "flex", flexDirection: "row", justifyContent: "flex-end"}}>
                        <Button disabled={taskName.length === 0 || taskDuration.length === 0} variant="contained" startIcon={<AddTask/>} onClick={createCard}>Ajouter</Button>
                </CardActions>
            </Card>
            <Box sx={{display: "flex", justifyContent: "flex-end", gap: 2, m: 2}}>
                <Button disabled={tasks.length === 0} color={"error"} onClick={() => setTasks([])} startIcon={<Delete/>}>Delete</Button>
            </Box>

            <MPM tasks={tasks} />
        </Box>
    );
}
