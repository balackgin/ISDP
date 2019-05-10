import { Loading, Message, MessageBox } from 'element-ui';
import successIcon from '@ISDP/assets/images/common/common_toast_icon_success.png';
import failIcon from '@ISDP/assets/images/common/common_toast_icon_error.png';
// const Prompt = MessageBox.prompt;
// Message start
// Message start
// Message start
const messageFun = (args) => {
  if (typeof args === 'string' || (typeof args === 'object' && args.message)) {
    Message(
      Object.assign(
        {
          duration: 3000,
          customClass: 'el-message-wrap'
        },
        args
      )
    );
  } else {
    console.warn(
      `plugins message: params error; params: ${ typeof args }: ${ args }`
    );
  }
};
let toastTimer = '';

function tooltipFun(args) {
  if (args && args.message) {
    const { message, type = 'success', time = 3000 } = args;
    let toastEle = document.querySelector('.toast-wrap'),
      // toastContent = `<i class="icon el-icon-${ type }"></i>${ message }`;
      toastContent = `<img src="${
        type === 'success' ? successIcon : failIcon
      }" alt="" class="icon"/> ${ message }`;

    if (toastEle) {
      toastEle.innerHTML = toastContent;
    } else {
      toastEle = document.createElement('div');
      toastEle.className = 'toast-wrap';
      toastEle.innerHTML = toastContent;
      document.body.appendChild(toastEle);
    }
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      document.body.removeChild(toastEle);
    }, time);
  } else {
    console.warn('Cannot read property "message" of undefined');
  }
}
// Message end
// Message end
// Message end
function msgBoxFun(args) {
  const fn = args.prompt
    ? MessageBox.prompt
    : (args.alert && MessageBox.alert) || MessageBox.confirm;
  return fn(
    args.message || args.text,
    args.title,
    Object.assign(
      {},
      {
        closeOnClickModal: false,
        closeOnPressEscape: false
      },
      args
    )
  );
}
// Confirm end
// Confirm end
// Confirm end
// num uppercase start
// num uppercase start
// num uppercase start

let indexArr = [ '', '一', '二', '三', '四', '五', '六', '七', '八', '九' ],
  companyArr = [
    '',
    '十',
    '百',
    '千',
    '万',
    '十',
    '百',
    '千',
    '亿',
    '十',
    '百',
    '千',
    '万',
    '十',
    '百',
    '千'
  ];

function numUppercase(args) {
  // 数字转化 数字转变为对应文字 1000以内
  let num = +args,
    str = String(num),
    reverseStr = str.split('').reverse();
  if (Number.isNaN(num) || num < 0 || str.length > companyArr.length) {
    // 正整数
    console.warn('arguments is error!');
    return args;
  }
  let resultStr = '';
  reverseStr.forEach((item, idx) => {
    const getCompany = companyArr[idx];
    resultStr +=
      [ '十', '百', '千' ].includes(getCompany) && +item === 0
        ? /^.*零$/.test(resultStr)
          ? ''
          : '零'
        : getCompany + indexArr[+item];
  });
  return resultStr
    .split('')
    .reverse()
    .join('');
}
// num uppercase end
// num uppercase end
// num uppercase end

function setSearchResult(vm, args) {
  const { $store } = vm;
  $store.dispatch('common/session', {
    //存搜索条件
    key: 'searchCriteria',
    val: args,
    action: {
      isCopy: true,
      isSession: true
    }
  });
}

async function getSearchResult(vm) {
  const { $store } = vm;
  await $store.dispatch('common/session', {
    //取搜索条件
    key: 'searchCriteria',
    action: {
      isSession: true
    }
  });
  // let params = interimVal.plList;
  //       this.listParams = params;
  //       listConfig.searchObj = params.obj;
  //       this.listConfigCopy = listConfig.toJson();
}

// Loading start
// Loading start
// Loading start
let loading = null;

function loadingFun(bool) {
  // loading
  if (loading || bool === false) {
    loading && loading.close();
    loading = null;
  } else {
    loading = Loading.service({
      fullscreen: true,
      background: 'rgba(0,0,0,0.4)'
    });
  }
}
// Loading end
// Loading end
// Loading end

async function changeProject(projectId, nextRoute) {
  // 改变项目 项目id
  const { $route, $router, $store } = this;

  await $store.dispatch('ISDP/common/getMenuList', {
    projectId
  });
  $store.commit('ISDP/project/SET_PROJECT_ID', projectId);
  $router.push(
    nextRoute || {
      name: $route.name,
      query: {
        id: projectId
      }
    }
  );
}

//callback start
//callback start
//callback start
function callback(fnName, ...args) {
  // 事件触发 寻找当前作用域 没有则向父组件传递
  const { options } = this;
  // 寻找options 或者options.actions的方法 没有则给父组件
  options && options[fnName]
    ? options[fnName](this, ...args)
    : (options &&
        options.actions &&
        options.actions[fnName] &&
        options.actions[fnName](this, ...args)) ||
      this.$emit('callback', fnName, ...args);
}
// callback end
// callback end
// callback end
//download start
//download start
//download start
function download(content, fileName) {
  // response: result.data;
  // 下载文件 设置文件名
  if (navigator.msSaveOrOpenBlob) {
    //IE
    navigator.msSaveOrOpenBlob(content, fileName);
  } else {
    let url = URL.createObjectURL(content);
    let link = document.createElement('a');
    link.href = url;
    // link.target = '_blank';
    link.download = fileName; //设置文件名
    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(url); // 让链接失效
    document.body.removeChild(link);
  }
}
//download end
//download end
//download end

// isChangeWidth start
function isChangeWidth(vm, form, opts, event, isOther) {
  const tar = event.target,
    val = form[opts.prop],
    ele = document.getElementById('handleMouseenter');
  if (!val) {
    return false;
  }
  // 用span 存值 可以获取该input所占宽度
  let span;
  if (ele) {
    ele.innerHTML = val;
    span = ele;
  } else {
    span = document.createElement('span');
    span.innerHTML = val;
    span.id = 'handleMouseenter';
    span.style =
      'position:absolute; z-index: -10; top: -100%; left: -100%; visibility:hidden; display:inline-block;';
    (document.getElementById('app') || document.body).appendChild(span);
  }
  // 比较宽度 pad: padding以及其他内容宽度
  let pad = isOther ? 60 : 10;
  if ((span.offsetWidth || span.clientWidth) + pad >= tar.clientWidth) {
    vm.currentTooltipProp = opts.prop;
    return true;
  }
}

// isChangeWidth end

function inputFlag(options, remoteData = {}, type = 'Disabled') {
  // type: Disabled / Readonly /Required
  const remoteDisabled = remoteData[options.prop + type];
  return [ true, false ].includes(remoteDisabled)
    ? remoteDisabled
    : type === 'Required'
      ? options.required
      : options[type.toLocaleLowerCase()];
}

function getProxyObj(fn, name) {
  return {
    get() {
      return fn;
    },
    set() {
      console.warn(`${ name } error: no setup allowed!`);
    }
  };
}
let proxyLoading = getProxyObj(loadingFun, 'elLoading'),
  proxyMessage = getProxyObj(messageFun, 'elMessage'),
  proxyCallback = getProxyObj(callback, 'proxyCallback'),
  proxyMsgBox = getProxyObj(msgBoxFun, 'proxyMsgBox'),
  proxyNumUp = getProxyObj(numUppercase, 'proxyNumUp'),
  proxySetSearch = getProxyObj(setSearchResult, 'proxySetSearch'),
  proxyGetSearch = getProxyObj(getSearchResult, 'proxyGetSearch'),
  proxyIsChangeWidth = getProxyObj(isChangeWidth, 'proxyIsChangeWidth'),
  proxyDownload = getProxyObj(download, 'proxyDownload'),
  proxyInputFlag = getProxyObj(inputFlag, 'proxyInputFlag'),
  proxyTooltip = getProxyObj(tooltipFun, 'proxyTooltip'),
  proxyChangeProject = getProxyObj(changeProject, 'proxyChangeProject');

export default Object.assign(
  {
    elMessage: proxyMessage.get(),
    elLoading: proxyLoading.get(),
    elTooltip: proxyTooltip.get()
  },
  {
    install(Vue) {
      Object.defineProperties(Vue.prototype, {
        $elLoading: proxyLoading,
        $elMessage: proxyMessage,
        $elTooltip: proxyTooltip,
        $callback: proxyCallback,
        $elMsgBox: proxyMsgBox,
        $numUppercase: proxyNumUp,
        $download: proxyDownload,
        $getSearch: proxyGetSearch,
        $setSearch: proxySetSearch,
        $isChangeWidth: proxyIsChangeWidth,
        $inputFlag: proxyInputFlag,
        $changeProject: proxyChangeProject
      });
    }
  }
);
