import api from '@ISDP/api/common';
import spriteConfig from '@ISDP/assets/images/menuSprite';
export default {
  namespaced: true,
  state: {
    menuData: null,
    menuObj: null,
    currentMenu: null,
    permissionMenu: null
  },
  mutations: {
    setMenuData(state, args = {}) {
      state.menuData = args.menuData;
      state.menuObj = args.menuObj;
    },
    setCurrentMenuData: (state, args) => (state.currentMenu = args),
    setPermissionMenuData: (state, args) => (state.permissionMenu = args)
  },
  actions: {
    async getMenuList(store, params) {
      const { data } = await api.getMenuList(params);
      let result = {
        menuData: [],
        menuObj: {}
      };
      const permissionArr = [];
      if (data) {
        const navObj = {},
          menuFn = (opts, data = []) => {
            const { urlPath, select } = opts;
            if (urlPath) {
              const currentKey = urlPath.trim();
              navObj[currentKey] = data;
              select && permissionArr.push(currentKey);
            }
          },
          navArr = data.map((item) => {
            // 处理一级菜单icon start
            const { icon } = item;
            if (icon) {
              const iconObj = spriteConfig[icon + '_n'];
              item.iconStyle =
                iconObj &&
                `background-position: ${ iconObj.offset_x }px ${
                  iconObj.offset_y
                }px`;

              const iconObjHover = spriteConfig[icon + '_h'];
              item.iconHoverStyle =
                iconObjHover &&
                `background-position: ${ iconObjHover.offset_x }px ${
                  iconObjHover.offset_y
                }px`;

              const iconObjActive = spriteConfig[icon + '_p'];
              item.iconActiveStyle =
                iconObjActive &&
                `background-position: ${ iconObjActive.offset_x }px ${
                  iconObjActive.offset_y
                }px`;
            }

            // 处理一级菜单icon end
            // 处理一级菜单icon end
            // 处理一级菜单icon end

            const { children } = item;
            menuFn(item, [ item ]);
            // urlPath ? navObj[urlPath] = [ item ] : ''; // 第一级不能作为最后一级

            // 第二级 forEach start
            (children || []).forEach((secondItem) => {
              const { children } = secondItem;

              menuFn(secondItem, [ item, secondItem ]);
              // 第三级 forEach start
              (children || []).forEach((thirdItem) => {
                menuFn(thirdItem, [ item, secondItem, thirdItem ]);
              });
              // 第三级 end
              // 第三级 end
              // 第三级 end
            });
            // 第二级 end
            // 第二级 end
            // 第二级 end
            return item;
          });
        result = {
          menuData: navArr,
          menuObj: navObj
        };
      }
      store.commit('setPermissionMenuData', permissionArr);
      store.commit('setMenuData', result);
      return result;
    },
    delMenu(store, params) {
      return api.delMenu(params);
    },
    saveMenu(store, params) {
      return api.saveMenu(params);
    },
    getFavoriteMenu(store, params) {
      return api.getFavoriteMenu(params);
    },
    getMilestoneList(store, params) {
      return api.getMilestoneList(params);
    }
  }
};
