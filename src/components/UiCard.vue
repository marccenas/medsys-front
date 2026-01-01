<template>
  <button class="tile" type="button" @click="$emit('click')">
    <div class="tile-icon">
      <slot name="icon">
        <font-awesome-icon icon="users" />
      </slot>
    </div>

    <div class="tile-text">
      <div class="tile-title"><slot name="title" /></div>
      <div class="tile-sub"><slot name="sub" /></div>
    </div>

    <div class="tile-arrow">›</div>
  </button>
</template>

<style scoped>
.tile{
  width: 100%;
  display: grid;
  grid-template-columns: 44px 1fr 20px;
  gap: 12px;
  align-items: center;
  padding: 14px 14px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: #ffffff;
  cursor: pointer;
  text-align: left;
  transition: transform .08s ease, box-shadow .08s ease;
}
.tile:hover{
  box-shadow: 0 14px 30px rgba(34, 50, 74, 0.10);
  transform: translateY(-1px);
}
.tile-icon{
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: rgba(45,118,214,0.10);
  display: grid;
  place-items: center;
  color: var(--blue);
  font-weight: 800;
}
.tile-title{
  font-weight: 700;
  color: var(--text);
}
.tile-sub{
  margin-top: 2px;
  font-size: 12px;
  color: var(--muted);
}
.tile-arrow{
  font-size: 22px;
  color: #8aa0bd;
}
</style>
