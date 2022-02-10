import React from 'react';
import { Skeleton } from 'antd';
import "./SideNavLoadingState.less";


function SideNavLoadingState() {
  const items = () => {
    const loadingItems: any = [];
    for (let i = 0; i < 10; i++) {
      const item = (
        <Skeleton.Input key={"SideNavLoadingState_" + i}
          style={{
            width: 80,
            marginBottom: 0,
            marginLeft: 0,
          }} className='skeleton_items'
          active
        />
      );
      loadingItems.push(item);
    }
    return loadingItems;
  };
  return <div className="skeleton">{items()}</div>;
}

export default SideNavLoadingState;