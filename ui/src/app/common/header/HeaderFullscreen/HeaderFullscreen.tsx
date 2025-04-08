import React, { useEffect, useRef } from 'react';
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import { RequireFullscreen } from '../../RequireFullscreen/RequireFullscreen';
import { Button } from 'antd';

export const HeaderFullscreen: React.FC = () => {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    rootRef.current = document.getElementById('root');
  }, []);

  return (
    <RequireFullscreen component={rootRef}>
      {(isFullscreen) => (
        <Button
          style={{ color: '#ffff' }}
          ghost={isFullscreen ? true : false}
          type={'text'}
          icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
        />
      )}
    </RequireFullscreen>
  );
};
