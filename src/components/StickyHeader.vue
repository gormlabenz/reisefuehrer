<template>
  <div id="sticky-header" class="header">
    <div
      ref="icon"
      style="width:40px; height: 3px; background-color: var(--ion-color-primary);  border-radius: 1.5px; "
    ></div>
  </div>
</template>

<script>
export default {
  mounted() {
    const el = document.querySelector(".header");
    const observer = new IntersectionObserver(
      ([e]) => e.target.classList.toggle("isSticky", e.intersectionRatio < 1),
      { threshold: [1] }
    );

    observer.observe(el);
  },
};
</script>

<style scoped>
.header {
  position: sticky;
  z-index: 100;
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
  z-index: 100;
}
</style>
