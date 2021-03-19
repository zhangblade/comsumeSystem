export default {
    
    data () {
        
        return {
            subMenu: {
                collapsed: false,
                width: 200,
                colWidth: 0,
            }
        }
    },
    computed: {
        
    },
    methods: {
        toggleSubMenu(){
            this.subMenu.collapsed = !this.subMenu.collapsed
        },
    }
  }
  