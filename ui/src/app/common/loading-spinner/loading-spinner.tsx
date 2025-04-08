import { ClockCircleOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import './loading-spinner.css';

/* eslint-disable-next-line */
export interface LoadingSpinnerProps {
  loading: boolean;
}

export const LoadingSpinner = (
  props: LoadingSpinnerProps
) => {
  // const antIcon = <LoadingOutlined style={{ fontSize: 75,color:'#fff' }} spin />;
  const antIcon = <ClockCircleOutlined    style={{ fontSize: 50,color:'#fff' }} spin />;
  return (
    <div id="loading-spinner" style={{ display: props.loading ? "block" : "none" }}>
      
      <div style={{ margin: "20% 0% 20% 0%" }}>
        <div className="ant-spin ant-spin-lg ant-spin-spinning ant-spin-show-text" >
          {/* <span className="ant-spin-dot ant-spin-dot-spin">
            <i className="ant-spin-dot-item"></i>
            <i className="ant-spin-dot-item"></i>
            <i className="ant-spin-dot-item"></i>
            <i className="ant-spin-dot-item">
            </i></span> */}
            <Spin indicator={antIcon} size="large"/>
          <div className="ant-spin-text" style={{color:'#fff'}}>Loading...</div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
