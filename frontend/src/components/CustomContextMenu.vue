<template>
    <div
        :class="classes"
        :style="styles"
        v-show="value"
        v-click-outside="onClickOutside"
    >
        <template v-for="(item, index) in _items">

            <div v-if="item.isDivider" :key="index" class="divider"></div>

            <div
                v-else
                :key="index"
                :class="{ 'item': true, 'submenu': !!item.submenu, '--disabled': !!item.disabled }"
                @mouseenter="onMouseEnter($event, index)"
                @mouseleave="onMouseLeave($event, index)"
                @click.stop.prevent="onClick(item)"
                class="d-flex align-items-center"
            >
                <div class="flex-fill">{{ item.label }}</div>
                <div v-if="item.submenu" class="ml-3" style="line-height:1em;">&#9205;</div>
                <context-menu
                    v-if="item.submenu"
                    :value="activeMenu === index"
                    :items="item.submenu"
                    :is-nested="true"
                    :is-flipped="{ x: flippedX, y: flippedY }"
                    :flippable="flippable"
                    @click="onChildClick"
                ></context-menu>
            </div>

        </template>
    </div>
</template>

<script>
import { Vue } from "vue-property-decorator";
// @ts-ignore



export default {
    props: {
        value: Boolean,
        items: [],
        x: Number,
        y: Number,
        isNested: Boolean,
        isFlipped: Boolean,
        flippable: Boolean
    },
    data: function() {
        return {
            activeMenu: -1,
            activeMenuResetTimeout: null,
            height: 0,
            rootIsFlipped: { x: false, y: false },
        }
    },
    created() {
        if (this.$options.components) {
            this.$options.components["context-menu"] = Vue.extend(ContextMenu);
        } else {
            this.$options.components = { "context-menu": Vue.extend(ContextMenu) };
        }
    },
    methods: {
        get styles() {
        const s = {};
        if (!this.isNested) {
            s.top = (this.flippedY ? this.y - this.height : this.y) + "px";
            s.left = this.x + "px";
        }
        return s;
        },
        get classes() {
            return {
                "dark-context-menu": true,
                "--flipped-x": this.flippedX,
                "--flipped-y": this.flippedY,
                "--nested": this.isNested
            };
        },
        get _items() {
            return this.items.map((i) => ({ ...i, hover: false }));
        },
        get flippedX() {
            return this.flippable && (this.rootIsFlipped.x || this.isFlipped.x);
        },
        get flippedY() {
            return this.flippable && (this.rootIsFlipped.y || this.isFlipped.y);
        },
        onClick(item) {
            if (!item.submenu && item.value) {
                this.$emit("click", item.value);
                this.$emit("input", false);
            }
        },
        onChildClick(value) {
            this.$emit("click", value);
            this.activeMenu = -1;
            if (!this.isNested) {
                this.$emit("input", false);
            }
        },
        onClickOutside(event) {
            if (this.value) {
                this.$emit("input", false);
            }
        },
        onMouseEnter(event, index) {
            if (this.items[index].submenu) {
                this.activeMenu = index;
                if (this.activeMenuResetTimeout !== null) {
                    clearTimeout(this.activeMenuResetTimeout);
                    this.activeMenuResetTimeout = null;
                }
            }
        },
        onMouseLeave(event, index) {
            if (this.items[index].submenu) {
                this.activeMenuResetTimeout = window.setTimeout(() => {
                    this.activeMenu = -1;
                    this.activeMenuResetTimeout = null;
                }, 200);
            }
        }
    },
    watch: {
        "connection.from.parent.position": {
            handler: function() {
                this.updateCoords();
            },
            deep: true
        },
        "connection.to.parent.position": {
            handler: function() {
                this.updateCoords();
            },
            deep: true
        },
        "items": {
            handler: function() {
                this.updateCoords();
            },
            deep: true
        },
        "value": {
            handler: function() {
                if (this.value) {
                    this.items.forEach((item) => {
                        if (item.disabledFunction) {
                            this.$set(item, "disabled", item.disabledFunction());
                        }
                    });
                }
            },
            deep: true,
            immediate: true
        }
    },
}
</script>