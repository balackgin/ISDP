import fetch from '@/utils/fetch';
export default {
  /**
   * 人员账号登录
   *
   * @param {*} args
   * username: 	账号/联系电话
   * password
   * loginType: 登录类型：密码/手机验证码
   * authCode  二次验证码（图片验证码）
   * @returns
   */
  login(args) {
    return fetch({
      url: '/easywork/api/auth/login',
      method: 'post',
      data: args
    });
  },

  /**
   * 登录账号注册
   *
   * @param {*} args
   * tel: 联系电话
   * password: 密码  / authCode: 手机验证码
   * @returns
   */
  register(args) {
    return fetch({
      url: '/easywork/api/platform/user/register',
      method: 'post',
      data: args
    });
  },

  /**
   * 短信验证码登录接口
   *
   * @param {*} args
   * tel: 手机号
   * @returns
   */
  getAuthCode(args) {
    return fetch({
      url: '/easywork/api/auth/sms/getauthcode',
      method: 'post',
      data: args
    });
  },

  /**
   * 重新设置密码接口
   *
   * @param {*} args
   * tel: 手机号
   * password: 密码
   * authCode: 验证码
   * @returns
   */
  setNewPassword(args) {
    return fetch({
      url: '/easywork/api/platform/user/modifypassword',
      method: 'post',
      data: args
    });
  },
  getEmployeeInfo(args) {
    return fetch({
      url: '/easywork/api/auth/queryemployee',
      metd: 'post',
      data: args
    })
  }
};