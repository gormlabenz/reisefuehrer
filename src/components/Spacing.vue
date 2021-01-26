<template>
  <div
    id="spacing"
    style="scroll-snap-align: start; height: 100vh; position: relative;"
  ></div>
</template>

<script>
import gsap from "gsap";

export default {
  mounted() {
    const el = document.getElementById("landschaft");
    const bottom = el.getBoundingClientRect().bottom - 32;
    gsap.to("#spacing", {
      height: bottom + "px",
      duration: 0.6,
      ease: "Power3.easeInOut",
    });
  },
};
</script>

<style></style>
