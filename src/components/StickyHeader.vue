<template>
  <div id="sticky-header" class="header">
    <div
      ref="icon"
      v-bind:class="{ 'ion-hide': icon }"
      style="width:40px; height: 3px; background-color: var(--ion-color-primary); border-radius: 1.5px; "
    ></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      icon: true,
    };
  },
  mounted() {
    const el = document.querySelector(".header");
    const observer = new IntersectionObserver(
      ([e]) => {
        e.target.classList.toggle("isSticky", e.intersectionRatio < 1);
        this.toggleIcon();
        console.log("sticky");
      },
      { threshold: [1] }
    );
    setTimeout(() => {
      observer.observe(el);
    }, 400);
  },
  methods: {
    toggleIcon() {
      this.icon = !this.icon;
    },
  },
};
</script>

<style scoped>
.header {
  position: sticky;
  z-index: 900;
  height: 32px;
  background-color: var(--ion-toolbar-background);
  border-radius: 32px 32px 0 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  top: -1px; /* ➜ the trick */
  padding: 1em;
  padding-top: calc(1em + 1px); /* ➜ compensate for the trick */

  transition: 0.2s;
}

.header.isSticky {
  border-radius: 0;
  height: 8px;
}
</style>
