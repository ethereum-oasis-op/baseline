
/* eslint-disable no-alert, no-console, react/no-find-dom-node */
import React from "react";
import '../../assets/styles/tree.css';
import '.../../assets/styles/tree-basic.css';
import Tree, { TreeNode } from 'rc-tree';

const treeData = [
  {
    key: '0x2b2d0c244fba195106fb6b9822b665c750ce0595fa01d2e9a7169a1caf458826',
    title: 'root',
    children: [
      /*{ 
      key: 'frontier', 
      title: 'frontier', 
      children: [
          { key: '0x333333333333333333333333333333333333333333333333333333', title: parseInt(0x333333333333333333333333333333333333333333333333333333,18) },
          { key: '0xbd8ddc725d485eb7dc8d78d1b5265e53c9d0037f874011528cd60c', title: parseInt(0xbd8ddc725d485eb7dc8d78d1b5265e53c9d0037f874011528cd60c,18) },
          { key: '0xba195106fb6b9822b665c750ce0595fa01d2e9a7169a1caf458826', title: parseInt(0xba195106fb6b9822b665c750ce0595fa01d2e9a7169a1caf458826,18) },
        ]},*/
      {
        key: '0x2b2d0c244fba195106fb6b9822b665c750ce0595fa01d2e9a7169a1caf458826_nodes',
        title: 'nodes',
        children: [
          { key: '0xba195106fb6b9822b665c750ce0595fa01d2e9a7169a1caf458826', title: parseInt(0xba195106fb6b9822b665c750ce0595fa01d2e9a7169a1caf458826,16) },
          { key: '0xbd8ddc725d485eb7dc8d78d1b5265e53c9d0037f874011528cd60c', title: parseInt(0xbd8ddc725d485eb7dc8d78d1b5265e53c9d0037f874011528cd60c,16) },
          { key: '0x5f93529eafdf78e8419cb78a3d8199aa7f8038ca100b9093cd3131', title: parseInt(0x5f93529eafdf78e8419cb78a3d8199aa7f8038ca100b9093cd3131,16) },
          { blockNumber: 4190780, leafIndex: 0, key: '0x1111111111111111111111111111111111111111111111111111111111111111', title: parseInt(0x459a3bb7921169f58b93de6991d7f4704a64ab0bc4b56d867035c843fca80780,16) },
          { blockNumber: 4190785, leafIndex: 1, key: '0x2222222222222222222222222222222222222222222222222222222222222222', title: parseInt(0x095430b13784148fc0858a538b63ccb4ed30aefb6fff39eb86f65ecb17c4c16a,16) },
          { blockNumber: 4190790, leafIndex: 2, key: '0x3333333333333333333333333333333333333333333333333333333333333333', title: parseInt(0xfd961e6ecb1b4564ce360b5be032641e10e34ce06062d4c32345097cf2c8a010,16) },
          { blockNumber: 4190880, leafIndex: 3, key: '0x4444444444444444444444444444444444444444444444444444444444444444', title: parseInt(0x447aec5fc6f114a62d7c93c05136537b17f2d2e15f8ebe215f65e7a80d2fabb4,16) },
        ],
      },
    ],
  },
];

class TreeData extends React.Component {
  static defaultProps = {
    keys: ['0x2b2d0c244fba195106fb6b9822b665c750ce0595fa01d2e9a7169a1caf458826'],
  };

  constructor(props) {
    super(props);
    const { keys } = props;
    this.state = {
      defaultExpandedKeys: keys,
      defaultSelectedKeys: keys,
      defaultCheckedKeys: keys,
    };

    this.treeRef = React.createRef();
  }

  onExpand = expandedKeys => {
    console.log('onExpand', expandedKeys);
  };

  onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
    this.selKey = info.node.props.eventKey;
  };

  onCheck = (checkedKeys, info) => {
    console.log('onCheck', checkedKeys, info);
  };

  onEdit = () => {
    setTimeout(() => {
      console.log('current key: ', this.selKey);
    }, 0);
  };

  onDel = e => {
    if (!window.confirm('sure to delete?')) {
      return;
    }
    e.stopPropagation();
  };

  setTreeRef = tree => {
    this.tree = tree;
  };

  render() {
    /*const customLabel = (
      <span className="cus-label">
        <span>operations: </span>
        <span style={{ color: 'blue' }} onClick={this.onEdit}>
          Edit
        </span>
        &nbsp;
        <label onClick={e => e.stopPropagation()}>
          <input type="checkbox" /> checked
        </label>
        &nbsp;
        <span style={{ color: '#EB0000' }} onClick={this.onDel}>
          Delete
        </span>
      </span>
    );*/

    return (
      <div style={{ margin: '0 11px' }} className="mb-6">
        <Tree
          ref={this.setTreeRef}
          className="myCls"
          showLine
          checkable
          selectable={false}
          //defaultExpandAll
          onExpand={this.onExpand}
          defaultSelectedKeys={this.state.defaultSelectedKeys}
          defaultCheckedKeys={this.state.defaultCheckedKeys}
          onSelect={this.onSelect}
          onCheck={this.onCheck}
          onActiveChange={key => console.log('Active:', key)}
          treeData={treeData}
        />          
        {/*<Tree
          ref={this.setTreeRef}
          className="myCls"
          showLine
          checkable
          defaultExpandAll
          defaultExpandedKeys={this.state.defaultExpandedKeys}
          onExpand={this.onExpand}
          defaultSelectedKeys={this.state.defaultSelectedKeys}
          defaultCheckedKeys={this.state.defaultCheckedKeys}
          onSelect={this.onSelect}
          onCheck={this.onCheck}
          onActiveChange={key => console.log('Active:', key)}
        >
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title={customLabel} key="0-0-0">
              <TreeNode title="leaf" key="0-0-0-0" style={{ background: 'rgba(255, 0, 0, 0.1)' }} />
              <TreeNode title="leaf" key="0-0-0-1" />
            </TreeNode>
            <TreeNode title="parent 1-1" key="0-0-1">
              <TreeNode title="parent 1-1-0" key="0-0-1-0" disableCheckbox />
              <TreeNode title="parent 1-1-1" key="0-0-1-1" />
            </TreeNode>
            <TreeNode title="parent 1-2" key="0-0-2" disabled>
              <TreeNode title="parent 1-2-0" key="0-0-2-0" checkable={false} />
              <TreeNode title="parent 1-2-1" key="0-0-2-1" />
            </TreeNode>
          </TreeNode>
        </Tree>*/}
      </div>
    );
  }
}

export default TreeData;