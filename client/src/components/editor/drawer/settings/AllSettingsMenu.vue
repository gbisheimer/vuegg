<template>
  <div class="menus-wrapper">
    <div class="tab-bar">
      <a title="Settings" class="tab" @click="toggleTab('settings')">
        <svgicon icon="system/settings" width="24" height="24"
          :color="showSettings ? '#2b6a73' : 'rgba(0,0,0,.38)'">
        </svgicon>
      </a>
      <a title="code" class="tab" @click="toggleTab('json')">
        <svgicon icon="system/code" width="24" height="24"
          :color="showJson ? '#2b6a73' : 'rgba(0,0,0,.38)'">
        </svgicon>
      </a>
      <a title="" class="tab">
        <svgicon icon="" width="24" height="24"
          :color="showJson ? '#2b6a73' : 'rgba(0,0,0,.38)'">
        </svgicon>
      </a>
      <div class="tab-indicator mdc-theme--primary-bg" :style="{'left': indiLeft, 'right': indiRight}"></div>
    </div>

    <div class="tab-content">
      <settings-menu v-show="showSettings" />
      <json-settings v-show="showJson" />
    </div>
  </div>
</template>

<script>
import SettingsMenu from './SettingsMenu.vue'
import JsonSettings from './JsonSettings.vue'

import '@/assets/icons/system/settings'
import '@/assets/icons/system/code'

export default {
  name: 'all-settings-menu',
  components: { SettingsMenu, JsonSettings },
  data: function () {
    return {
      showSettings: true,
      showJson: false,
      activeTabX: 0
    }
  },
  computed: {
    indiLeft () {
      return this.activeTabX + 'px'
    },
    indiRight () {
      return (240 - (this.activeTabX + 80)) + 'px'
    }
  },
  methods: {
    toggleTab (name) {
      if (name === 'settings') {
        this.showSettings = true
        this.showJson = false
        this.activeTabX = 0
      }
      if (name === 'json') {
        this.showJson = true
        this.showSettings = false
        this.activeTabX = 80
      }
    }
  }
}
</script>

<style scoped>
.tab {
  padding: 0 28px;
  height: 34px;
  cursor: pointer;
}
.tab-bar {
  display: inline-flex;
  padding-top: 10px;
  z-index: 1;
  /* border-bottom: 1px solid rgba(0,0,0,0.12); */
  box-shadow:
    0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12),
    0 3px 1px -2px rgba(0, 0, 0, 0.2);
}
.tab-indicator {
  top: 107px;
  height: 2px;
  position: absolute;
  transition: all .2s cubic-bezier(.4,0,.4,1).01s;
}
.tab-content {
  margin-top: 3px;
}
</style>
