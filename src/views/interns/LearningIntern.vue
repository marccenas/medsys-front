<template>
  <section class="intern-learning">
    <div class="dash-top">
      <div class="dash-title">
        <h1>Learning</h1>
        <p class="subtle">
          Learning Overview <span class="sep">›</span> Enhance your medical knowledge and skills.
        </p>
      </div>
    </div>

    <div class="kpi-row">
      <div class="kpi kpi-blue">
        <div class="kpi-left">
          <div class="kpi-label">Assigned Modules</div>
          <div class="kpi-ico"><font-awesome-icon icon="book" /></div>
        </div>
        <div class="kpi-value">5</div>
      </div>

      <div class="kpi kpi-orange">
        <div class="kpi-left">
          <div class="kpi-label">In Progress</div>
          <div class="kpi-ico"><font-awesome-icon icon="clock" /></div>
        </div>
        <div class="kpi-value">2</div>
      </div>

      <div class="kpi kpi-teal">
        <div class="kpi-left">
          <div class="kpi-label">Quizzes Due</div>
          <div class="kpi-ico"><font-awesome-icon icon="clipboard-check" /></div>
        </div>
        <div class="kpi-value">1</div>
      </div>

      <div class="kpi kpi-red">
        <div class="kpi-left">
          <div class="kpi-label">Completed</div>
          <div class="kpi-ico"><font-awesome-icon icon="check" /></div>
        </div>
        <div class="kpi-value">7</div>
      </div>
    </div>

    <div class="grid">
      <!-- Recent Activities -->
      <section class="card glass panel">
        <div class="panel-head">
          <h3>Recent Activities</h3>
        </div>

        <div class="list">
          <button class="row" type="button">
            <span class="row-ico blue">
              <font-awesome-icon icon="check" />
            </span>
            <span class="row-main">
              <span class="row-title">ECG Interpretation Quiz</span>
            </span>
            <span class="row-meta">14 hours ago</span>
          </button>

          <button class="row" type="button">
            <span class="row-ico soft">
              <font-awesome-icon icon="file-lines" />
            </span>
            <span class="row-main">
              <span class="row-title">New Module Assigned:</span>
              <span class="row-sub">Hypertension Management</span>
            </span>
            <span class="row-meta">2 days ago</span>
          </button>

          <button class="row" type="button">
            <span class="row-ico orange">
              <font-awesome-icon icon="clipboard-list" />
            </span>
            <span class="row-main">
              <span class="row-title">New Assignment:</span>
              <span class="row-sub">Case Study: Diabetic Ketoacidosis</span>
            </span>
            <span class="row-meta">4 days ago</span>
          </button>
        </div>

        <button class="panel-link" type="button">
          View All Activities <font-awesome-icon icon="chevron-right" />
        </button>
      </section>

      <!-- Featured Modules -->
      <section class="card glass panel">
        <div class="panel-head">
          <h3>Featured Modules</h3>
        </div>

        <div class="list">
          <button class="row arrow" type="button">
            <span class="tile-ico blue">
              <font-awesome-icon icon="book-medical" />
            </span>

            <span class="row-main">
              <span class="row-title">Clinical Guidelines</span>
              <span class="row-sub">Core protocols and clinical best practices.</span>
            </span>

            <span class="chev"><font-awesome-icon icon="chevron-right" /></span>
          </button>

          <button class="row arrow" type="button">
            <span class="tile-ico orange">
              <font-awesome-icon icon="notes-medical" />
            </span>

            <span class="row-main">
              <span class="row-title">
                Hypertension Management
                <span class="tag new">New</span>
              </span>
              <span class="row-sub">For protocols on diagnosis and management.</span>
            </span>

            <span class="chev"><font-awesome-icon icon="chevron-right" /></span>
          </button>

          <button class="row arrow" type="button">
            <span class="tile-ico green">
              <font-awesome-icon icon="flask-vial" />
            </span>

            <span class="row-main">
              <span class="row-title">Case Study: Diabetic Ketoacidosis</span>
              <span class="row-sub">Learning DKA diagnosis and treatment.</span>
            </span>

            <span class="chev"><font-awesome-icon icon="chevron-right" /></span>
          </button>
        </div>
      </section>

      <!-- Recommended Quizzes -->
      <section class="card glass panel">
        <div class="panel-head">
          <h3>Recommended Quizzes</h3>
        </div>

        <div class="list">
          <div class="row static">
            <span class="dot blue"></span>
            <span class="row-main">
              <span class="row-title">Medical Terminology</span>
              <span class="row-sub">Assignment due in 4 days.</span>
            </span>
            <span class="tag warn">Noted</span>
          </div>

          <div class="row static">
            <span class="dot orange"></span>
            <span class="row-main">
              <span class="row-title">Hypertension Management</span>
              <span class="row-sub">Comprehensive interpretation.</span>
            </span>
            <span class="tag soft">Set</span>
          </div>

          <div class="row static">
            <span class="dot red"></span>
            <span class="row-main">
              <span class="row-title">Basic EKG Interpretation</span>
              <span class="row-sub">Comprehensive EKG basics.</span>
            </span>
            <span class="tag pink">Task</span>
          </div>
        </div>

        <button class="panel-link" type="button">
          View Full Activities <font-awesome-icon icon="chevron-right" />
        </button>
      </section>

      <!-- Quick Resources -->
      <section class="card glass panel">
        <div class="panel-head">
          <h3>Quick Resources</h3>
        </div>

        <div class="list">
          <button class="row arrow" type="button">
            <span class="tile-ico blue">
              <font-awesome-icon icon="book-medical" />
            </span>

            <span class="row-main">
              <span class="row-title">Clinical Guidelines</span>
              <span class="row-sub">Four protocols and the clinical guidelines.</span>
            </span>

            <span class="chev"><font-awesome-icon icon="chevron-right" /></span>
          </button>

          <button class="row arrow" type="button">
            <span class="tile-ico orange">
              <font-awesome-icon icon="list-check" />
            </span>

            <span class="row-main">
              <span class="row-title">Task Management</span>
              <span class="row-sub">Organized track taking our tasks.</span>
            </span>

            <span class="chev"><font-awesome-icon icon="chevron-right" /></span>
          </button>

          <button class="row arrow" type="button">
            <span class="tile-ico blue2">
              <font-awesome-icon icon="heart" />
            </span>

            <span class="row-main">
              <span class="row-title">EKG Interpretation</span>
              <span class="row-sub">Comprehensive check EKGs.</span>
            </span>

            <span class="chev"><font-awesome-icon icon="chevron-right" /></span>
          </button>
        </div>

        <button class="panel-link" type="button">
          View Full Activities <font-awesome-icon icon="chevron-right" />
        </button>
      </section>
    </div>
  </section>
</template>

<script setup>
// frontend-only UI page
</script>

<style scoped>
.intern-learning{ padding: 18px 18px 24px; }
.sep{ margin: 0 6px; opacity: .55; }

.dash-title h1{
  margin:0;
  font-size: 30px;
  font-weight: 900;
  letter-spacing:-0.02em;
}
.dash-title p{ margin: 6px 0 0; font-size: 14px; }

.card{
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 16px;
  background: rgba(255,255,255,0.60);
  box-shadow: 0 10px 26px rgba(35, 55, 110, 0.12);
  overflow:hidden;
}
.glass{ backdrop-filter: blur(10px); }

.kpi-row{
  display:grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin: 12px 0 14px;
}
.kpi{
  border-radius: 14px;
  padding: 14px 16px;
  color:#fff;
  display:flex;
  align-items:center;
  justify-content:space-between;
  box-shadow: 0 10px 24px rgba(0,0,0,0.10);
  min-height: 74px;
}
.kpi-left{ display:flex; flex-direction:column; gap: 6px; }
.kpi-label{ font-weight: 800; font-size: 14px; opacity: 0.96; }
.kpi-ico{ opacity: .9; font-size: 14px; }
.kpi-value{ font-weight: 900; font-size: 34px; line-height: 1; letter-spacing: -0.03em; }

.kpi-blue{ background: linear-gradient(135deg, #6f8cff, #4f77ff); }
.kpi-orange{ background: linear-gradient(135deg, #ffbf70, #ff9a3d); }
.kpi-teal{ background: linear-gradient(135deg, #4cc3b8, #23b5a8); }
.kpi-red{ background: linear-gradient(135deg, #ff6c6c, #ff4a4a); }

.grid{
  display:grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.panel{ padding: 12px 14px; }
.panel-head{
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding: 6px 4px 10px;
}
.panel-head h3{
  margin:0;
  font-size: 18px;
  font-weight: 900;
  color: rgba(30,40,70,0.92);
}

.list{
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: 14px;
  overflow:hidden;
  background: rgba(255,255,255,0.35);
}

.row{
  width:100%;
  display:flex;
  align-items:center;
  gap: 12px;
  padding: 12px 12px;
  border: none;
  background: transparent;
  cursor:pointer;
}
.row + .row{ border-top: 1px solid rgba(0,0,0,0.06); }
.row.static{ cursor: default; }

.row-ico{
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display:grid;
  place-items:center;
  font-size: 14px;
  flex: 0 0 auto;
  border: 1px solid rgba(0,0,0,0.06);
  background: rgba(255,255,255,0.55);
}
.row-ico.blue{ background: rgba(47,86,255,0.14); color:#2f56ff; border-color: rgba(47,86,255,0.18); }
.row-ico.orange{ background: rgba(255,154,61,0.16); color:#cc6f10; border-color: rgba(255,154,61,0.18); }
.row-ico.soft{ background: rgba(120,130,160,0.14); color: rgba(40,55,95,0.9); border-color: rgba(120,130,160,0.18); }

.tile-ico{
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display:grid;
  place-items:center;
  flex: 0 0 auto;
  border: 1px solid rgba(0,0,0,0.06);
}
.tile-ico.blue{ background: rgba(47,86,255,0.14); color:#2f56ff; border-color: rgba(47,86,255,0.18); }
.tile-ico.orange{ background: rgba(255,154,61,0.16); color:#ff8c3a; border-color: rgba(255,154,61,0.18); }
.tile-ico.green{ background: rgba(35,181,168,0.14); color:#17867d; border-color: rgba(35,181,168,0.18); }
.tile-ico.blue2{ background: rgba(79,119,255,0.14); color:#2f56ff; border-color: rgba(79,119,255,0.18); }

/* ✅ FIX: force left alignment for the text block in EVERY row (Featured/Quick/etc.) */
.row-main{
  min-width: 0;
  flex: 1;
  display:flex;
  flex-direction:column;
  align-items: flex-start;   /* 🔥 FIX */
  justify-content: center;
  text-align: left;          /* 🔥 FIX */
  gap: 4px;
}

.row-title{
  font-weight: 900;
  color: rgba(30,40,70,0.92);
  line-height: 1.15;
}
.row-sub{
  font-size: 13px;
  color: rgba(60,70,95,0.72);
  font-weight: 700;
  line-height: 1.2;
}
.row-meta{
  margin-left:auto;
  font-size: 12px;
  font-weight: 800;
  color: rgba(60,70,95,0.62);
}

.chev{
  margin-left:auto;
  opacity: .55;
}
.row.arrow .row-meta{ display:none; }

.dot{
  width: 10px;
  height: 10px;
  border-radius: 999px;
  flex: 0 0 auto;
}
.dot.blue{ background: #4f77ff; }
.dot.orange{ background: #ff9a3d; }
.dot.red{ background: #ff4a4a; }

.tag{
  margin-left:auto;
  font-size: 11px;
  font-weight: 900;
  padding: 4px 8px;
  border-radius: 999px;
  border: 1px solid rgba(0,0,0,0.08);
  background: rgba(255,255,255,0.55);
  color: rgba(30,40,70,0.85);
}
.tag.new{ background: rgba(255,154,61,0.18); color:#cc6f10; border-color: rgba(255,154,61,0.22); }
.tag.warn{ background: rgba(255,154,61,0.16); color:#cc6f10; }
.tag.soft{ background: rgba(120,130,160,0.14); color: rgba(40,55,95,0.85); }
.tag.pink{ background: rgba(255,77,79,0.14); color:#d64545; }

.panel-link{
  margin: 10px auto 0;
  width: 100%;
  border: none;
  background: transparent;
  color: #2f56ff;
  font-weight: 900;
  padding: 10px 0 4px;
  cursor: pointer;
  display:flex;
  align-items:center;
  justify-content:center;
  gap: 8px;
}

@media (max-width: 1100px){
  .kpi-row{ grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 860px){
  .grid{ grid-template-columns: 1fr; }
}
@media (max-width: 640px){
  .kpi-row{ grid-template-columns: 1fr; }
}
</style>
