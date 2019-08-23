<template>
  <div class="editor" id="jsoneditor" ref="jsoneditor"></div>
</template>


<script>
import { mapState, mapMutations } from 'vuex'
import { updatePage, updateEgglement } from '@/store/types'

import JSONEditor from 'jsoneditor/dist/jsoneditor.min'
import 'jsoneditor/dist/jsoneditor.min.css'
import MenuToggle from '@/components/editor/common/MenuToggle'

export default {
  name: 'json-settings',
  components: { MenuToggle },
  data: function () {
    return {
    }
  },
  mounted: function () {
    let self = this
    let container = this.$refs.jsoneditor
    let options = {
      modes: ['tree', 'form', 'code', 'view', 'text'],
      // theme: 'bootstrap3',
      onChange: function () {
        try {
          let newValue = self.editor.get()
          delete (newValue['egglement'])
          self.saveChanges(newValue)
        } catch (e) {
          console.log(e)
        }
      }
    }
    this.editor = new JSONEditor(container, options)
    this.editor.setMode('code')
    if (this.editor.getMode().includes(['tree', 'view', 'form'])) {
      this.editor.expandAll()
    }
  },
  beforeDestroy: function () {
    this.editor.destroy()
  },
  computed: {
    selectedItem () {
      return (this.selectedElements.length === 0)
        ? this.activePage
        : (this.selectedElements.length > 1)
          ? this.selectedElements
          : this.selectedElements[0]
    },
    ...mapState({
      activePage: state => state.app.selectedPage,
      selectedElements: state => state.app.selectedElements
    })
  },
  watch: {
    'selectedItem': function (val) {
      if (val !== null) {
        this.editor.set(val)
        if (this.editor.getMode().includes(['tree', 'view', 'form'])) {
          this.editor.expandAll()
        }
      }
    }
  },
  methods: {
    saveChanges (newValue) {
      if (this.selectionType === 'page') {
        this.updatePage({page: this.activePage, ...newValue})
      } else if (this.selectionType === 'multiple') {
        this.selectedItem.map(egglement => this.updateEgglement({egglement, ...newValue}))
      } else {
        this.updateEgglement({egglement: this.selectedItem, ...newValue})
      }
    },
    ...mapMutations([updatePage, updateEgglement])
  }
}
</script>


<style scoped>
.editor{
  width: 100%;
  height: 600px;
  margin: 1px;
  margin-bottom: 10px;
}
</style>
