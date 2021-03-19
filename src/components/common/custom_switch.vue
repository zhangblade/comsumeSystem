<template>
  <div :class="['cus_switch', {'cus_switch_checked': switchStatus}]" :value="switchStatus" @click="toggleSwitchStatus">
    <Icon class="icon icon_open" v-if="switchStatus" type="md-checkmark"></Icon>
    <Icon class="icon icon_close" v-if="!switchStatus" type="md-close"></Icon>
  </div>
</template>
<script>
export default {
    name: "customSwitch",
    props: {
        switchStatus: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        toggleSwitchStatus() {
            this.$emit('toggleSwitchStatus')
        },
    },
    watch: {

    }
};
</script>

<style lang="less" scoped>


// ------------    自定义 switch start            ---------------------

.cus_switch{
  display: inline-block;
  width: 44px;
  height: 22px;
  line-height: 20px;
  border-radius: 22px;
  vertical-align: middle;
  border: 1px solid #ccc;
  background-color: #ccc;
  color: #ccc;
  position: relative;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-transition: all 0.2s ease-in-out;
  transition: all 0.2s ease-in-out;
  &::after{
      content: '';
      width: 18px;
      height: 18px;
      border-radius: 18px;
      background-color: #fff;
      position: absolute;
      left: 1px;
      top: 1px;
      cursor: pointer;
      -webkit-transition: left 0.2s ease-in-out, width 0.2s ease-in-out;
      transition: left 0.2s ease-in-out, width 0.2s ease-in-out;
  }
  .icon{
    color: #fff;
    font-size: 12px;
    position: absolute;
    left: 23px;
    top: 4px;
    &_open{
      left: 7px;
    }
  }
  &_checked{
      border: 1px solid #0099cc;
      background-color: #0099cc;
      color: #0099cc;
      &::after{
          left: 23px;
      }
  }
}
// ------------    自定义 switch end             ---------------------
</style>
