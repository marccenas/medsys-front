<template>
  <section class="settings-page">
    <!-- Page header -->
    <div class="page-head">
      <h1 class="page-title">Settings</h1>

      <div class="crumbs">
        <span class="crumb-strong">Settings Overview</span>
        <span class="crumb-sep">›</span>
        <span class="crumb-muted">
          Adjust and customize your account settings.
        </span>
      </div>
    </div>

    <!-- Cards grid -->
    <div class="settings-grid">
      <article
        v-for="c in cards"
        :key="c.key"
        class="set-card"
      >
        <div class="set-top">
          <div class="set-ico">
            <font-awesome-icon :icon="c.icon" />
          </div>

          <div class="set-text">
            <h3 class="set-title">{{ c.title }}</h3>
            <p class="set-sub">{{ c.subtitle }}</p>
          </div>
        </div>

        <RouterLink
          v-if="c.actionTo"
          :to="c.actionTo"
          class="btn-edit"
        >
          {{ c.actionLabel }}
        </RouterLink>
      </article>
    </div>
  </section>
</template>

<script setup>
const cards = [
  {
    key: "account",
    icon: ["fas", "user-gear"],
    title: "Account Settings",
    subtitle: "Update your profile information and preferences.",
    actionLabel: "Edit",
    actionTo: "/settings/account",
  },
  {
    key: "notifications",
    icon: ["fas", "bell"],
    title: "Notifications",
    subtitle: "Manage your alert preferences and settings.",
    actionLabel: "Edit",
    actionTo: "/settings/notifications",
  },
  {
    key: "security",
    icon: ["fas", "lock"],
    title: "Password & Security",
    subtitle: "Change your password and update security settings.",
    actionLabel: "Edit",
    actionTo: "/settings/security",
  },
  {
    key: "apps",
    icon: ["fas", "plug-circle-bolt"],
    title: "Connected Apps",
    subtitle: "Manage third-party integrations and linked apps.",
    actionLabel: "Edit",
    actionTo: "/settings/apps",
  },
  {
    key: "schedule",
    icon: ["fas", "calendar-check"],
    title: "Schedule Settings",
    subtitle: "Adjust your availability, calendar, and reminder settings.",
    actionLabel: "Edit",
    actionTo: "/settings/schedule",
  },
  {
    key: "help",
    icon: ["fas", "comment-medical"],
    title: "Help & Support",
    subtitle: "Access help documentation and support resources.",
    actionLabel: "View",
    actionTo: "/help", // or external link if needed
  },
  {
    key: "privacy",
    icon: ["fas", "shield-halved"],
    title: "Privacy Settings",
    subtitle: "Review your privacy settings and data preferences.",
    actionLabel: "Edit",
    actionTo: "/settings/privacy",
  },
];
</script>

<style scoped>
/* Page */
.settings-page{
  padding: 22px 26px 26px;
}

/* Header */
.page-head{ margin-bottom: 18px; }

.page-title{
  margin: 0 0 10px;
  font-size: 40px;
  font-weight: 900;
  color: #2b3752;
}

.crumbs{
  display:flex;
  gap:10px;
  font-size:18px;
  color:#6c7fa1;
}
.crumb-strong{ font-weight:900; color:#3a4a67; }
.crumb-sep{ opacity:.6; }

/* Grid */
.settings-grid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:18px 20px;
}

/* Card */
.set-card{
  border-radius:16px;
  border:1px solid rgba(226,232,244,.95);
  background:linear-gradient(180deg,rgba(255,255,255,.92),rgba(245,249,255,.72));
  box-shadow:
    0 16px 30px rgba(34,50,74,.10),
    inset 0 1px 0 rgba(255,255,255,.9);
  padding:18px;
}

/* Top */
.set-top{
  display:flex;
  gap:14px;
  margin-bottom:14px;
}

.set-ico{
  width:46px;
  height:46px;
  display:grid;
  place-items:center;
}

.set-ico svg{
  font-size:24px;
  color:rgba(45,118,214,.9);
}

.set-title{
  margin:2px 0 6px;
  font-size:26px;
  font-weight:900;
  color:#33435f;
}

.set-sub{
  margin:0;
  font-size:16px;
  color:#6c7fa1;
  font-weight:600;
}

/* Button */
.btn-edit{
  display:block;
  width:100%;
  padding:12px 14px;
  border-radius:10px;
  text-align:center;
  font-weight:900;
  font-size:16px;
  color:#fff;
  text-decoration:none;

  background:linear-gradient(180deg,#4f8ef7,#2d76d6);
  border:1px solid rgba(45,118,214,.3);
  box-shadow:
    0 10px 18px rgba(45,118,214,.26),
    inset 0 1px 0 rgba(255,255,255,.28);
}

/* Responsive */
@media (max-width: 980px){
  .settings-grid{ grid-template-columns:1fr; }
  .page-title{ font-size:34px; }
}
/* =========================
   Responsive: Tablet
========================= */
@media (max-width: 1100px){
  .settings-page{
    padding: 18px 18px 22px;
  }

  .page-title{
    font-size: 34px;
  }

  .crumbs{
    font-size: 16px;
    flex-wrap: wrap;
    row-gap: 6px;
  }

  .settings-grid{
    gap: 14px 14px;
  }

  .set-card{
    padding: 16px 16px 14px;
    border-radius: 14px;
  }

  .set-ico{
    width: 42px;
    height: 42px;
    border-radius: 12px;
  }

  .set-ico svg{
    font-size: 22px;
  }

  .set-title{
    font-size: 22px;
  }

  .set-sub{
    font-size: 14px;
  }

  .btn-edit{
    padding: 11px 12px;
    font-size: 15px;
    border-radius: 10px;
  }
}

/* =========================
   Responsive: Mobile
========================= */
@media (max-width: 720px){
  .settings-page{
    padding: 16px 12px 20px;
  }

  .page-title{
    font-size: 28px;
    margin-bottom: 8px;
  }

  .crumbs{
    font-size: 14px;
    gap: 8px;
  }

  .settings-grid{
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .set-card{
    padding: 14px 14px 12px;
    border-radius: 14px;
  }

  .set-top{
    gap: 12px;
    margin-bottom: 12px;
  }

  .set-ico{
    width: 40px;
    height: 40px;
    border-radius: 12px;
  }

  .set-ico svg{
    font-size: 21px;
  }

  .set-title{
    font-size: 20px;
  }

  .set-sub{
    font-size: 13px;
    line-height: 1.4;
  }

  .btn-edit{
    padding: 11px 12px;
    font-size: 14px;
    border-radius: 10px;
  }
}

/* =========================
   Extra Small Phones
========================= */
@media (max-width: 420px){
  .page-title{
    font-size: 26px;
  }

  .set-title{
    font-size: 19px;
  }

  .set-sub{
    font-size: 12.5px;
  }

  .btn-edit{
    font-size: 13.5px;
    padding: 10px 12px;
  }
}

</style>
