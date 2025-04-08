import { notification } from 'antd';
import { IconType, NotificationPlacement } from 'antd/es/notification/interface';

// This method is used to display multiple Alert messages with maximum number of 3 
notification.config({ maxCount: 3, duration: 5, placement: 'top' });
export class AlertMessages {

  static getErrorMessage = (content: string, placement:NotificationPlacement = 'topRight') => {
    notification.error(
      {
        message: `Error : ${content}`,
        placement,
      }
    );
    return false;
  }

  static getSuccessMessage = (content: string, placement:NotificationPlacement = 'topRight') => {
    notification.success({
      message: `Success : ${content}`,
      placement,
    });
    return false;
  }

  static getWarningMessage = (content: string, placement:NotificationPlacement = 'topRight') => {
    notification.warning({
      message: `Warning : ${content}`,
      placement,
    });
    return false;
  }

  static getInfoMessage = (content: string, placement:NotificationPlacement = 'topRight') => {
    notification.info({
      message: `Inform : '${content}`,
      placement,
    });
    return false;
  }

  static getCustomMessage = (icon: IconType, content: string, placement:NotificationPlacement = 'topRight') => {
    notification.open({
      type: icon,
      message: content,
      placement,
    });
    return false;
  }

  render() {
    return;
  }
}

export default AlertMessages;

// export const AlertMessages = {
//   config: ({ maxCount, duration, placement }) => {
//     // This method is used to configure the notification system.
//     // You can add configuration options here as needed.
//   },
//   getErrorMessage: (content, placement = 'topRight') => {
    
//     alert('hai')
//     // This method is used to display an error notification.
//     return  <SweatAlert type={SweatAlertTypeEnum.error} message={content} onClose={() => {}} />;
//   },
  
//   getSuccessMessage: (content, placement = 'topRight') => {
//     // This method is used to display a  notification.
//     return  <SweatAlert type={SweatAlertTypeEnum.success} message={content} onClose={() => {}} />;
//   },
  
//   getWarningMessage: (content, placement = 'topRight') => {
//     // This method is used to display warning notification.
//     return  <SweatAlert type={SweatAlertTypeEnum.warning} message={content} onClose={() => {}} />;
//   },
  
//   getInfoMessage: (content, placement = 'topRight') => {
//     // This method is used to display a Info notification.
//     return  <SweatAlert type={SweatAlertTypeEnum.info} message={content} onClose={() => {}} />;
//   },
// };