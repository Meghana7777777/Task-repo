import { Result } from 'antd'

const UnderConstruction = () => {
  return (
    <Result
      status="500"
      title={<b>This Page Under Construction...</b>}
      subTitle=""
    />
  )
}

export default UnderConstruction