<template lang="pug">
  #app
    nav
      .cell.title h.hyunwoo
      .flex-empty
      .cell.item MEDIA ART
      .cell.item VISUALIZATION
      .cell.item PRACTICE
    router-view
</template>

<script>
import { store } from './vuex/store';

export default {
  name: 'App',
  store,
  methods: {},
};
</script>

<style lang="sass">

@import url('https://fonts.googleapis.com/css?family=PT+Sans:400,700')

*
  box-sizing: border-box

body
  background: #fff
  margin: 0
  padding: 0
  font-family: 'PT Sans', sans-serif

.flex-empty
  flex: 1

nav
  width: 100%
  position: fixed
  z-index: 2
  height: 56px
  background: rgba(255, 255, 255, 0.9)
  border-bottom: solid 1px #e7e7e7
  top: 0
  left: 0
  display: flex
  line-height: 56px
  padding: 0 16px
  .cell
    padding: 0 16px
    width: auto
  .title
    font-size: 16px
  .item

#app
  padding-top: 56px
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  text-align: center
  color: #2c3e50

</style>
