export default {
  seriesItemStyleColor: {
    color: (args) => {
      const { dataIndex } = args;

      return {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 1,
        y2: 1,
        global: false,
        colorStops:
          dataIndex === 0
            ? [
              {
                offset: 0,
                color: '#fe2323'
              },
              {
                offset: 1,
                color: '#f6f6f6'
              }
            ]
            : [
              {
                offset: 0,
                color: '#ececec'
              },
              {
                offset: 1,
                color: '#ececec'
              }
            ]
      };
    }
  },
  seriesDataLabelArr: [
    {
      show: true,
      position: 'center',
      color: '#f00000',
      fontSize: 32,
      height: 20,
      rich: {
        height: 20
      }
    },
    {
      show: true,
      position: 'center',
      color: '#3a3b3d',
      fontSize: 14,
      height: -6,
      rich: {
        height: -6
      }
    }
  ]
};
