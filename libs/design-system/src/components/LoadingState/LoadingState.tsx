import { Skeleton } from 'antd';
import './index.less';

type Props = {
  loop: number;
  width: number;
  marginBottom: number;
  marginLeft: number;
};

export const LoadingState = ({ loop, width, marginBottom, marginLeft }: Props) => {
  const items = () => {
    const loadingItems: any = [];
    for (let i = 0; i < loop; i++) {
      const item = (
        <Skeleton.Input
          style={{
            width: width,
            marginBottom: marginBottom,
            marginLeft: marginLeft,
          }}
          active
        />
      );
      loadingItems.push(item);
    }
    return loadingItems;
  };
  return <div className="skeleton">{items}</div>;
};
