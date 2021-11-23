import React from "react";
import Tree, { useTreeState } from 'react-hyper-tree';

const data = {
  id: 1,
  name: 'Parent 1',
  children: [
    {
      id: 2,
      name: 'Child 1',
      children: [
        {
          id: 5,
          name: 'Child 1__1',
        },
        {
          id: 6,
          name: 'Child 1__2',
        },
        {
          id: 7,
          name: 'Child 1__3',
        },
      ],
    },
  ],
}

const getTreeItem = (nodes, isNode) => {
    let result = [];
    nodes.map((node) => {

        let item = {
            id: 0,
            name: '',
            hash:''
        }

        if (node && isNode) {
            item.id = node.hash;
            item.name = node.hash;
            result.push(item);
        } else {
            item.id = node;
            item.name = node;
            result.push(item); 
        }
    })

    return result;
}

const TreeData = (props) => {

    let treedata = {};
    //console.log(props);

    if (props.data && props.data.latestRecalculation){
    //console.log(props)

    treedata = {
        id: props.data.latestRecalculation.root,
        name: `Root - ${props.data.latestRecalculation.root}`,
        children: [
          {
            id: 2,
            name: 'Frontier',
            children: getTreeItem(props.data.latestRecalculation.frontier, false),
          },
          {
            id: 3,
            name: 'Nodes',
            children: getTreeItem(props.data.nodes, true),
          },
        ],
      }

    }

    const { required, handlers } = useTreeState({
      data: treedata,
      id: 'merkleetree',
      defaultOpened: true,
    });
 
    return (
      <div style={{ margin: '0 11px', fontSize: '11px' }} className="mb-6">
        <Tree
            {...required}
            {...handlers}
        />
      </div>
    )
  }

export default TreeData;  