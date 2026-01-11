<div class="container">
  <h3>Schedule Preset</h3>
  <div>
    <input type="text" id="schedulePresetName" placeholder="Preset Name">
    <input type="datetime-local" id="scheduleDatetime">
    <button onclick="schedulePreset(document.getElementById('schedulePresetName').value, document.getElementById('scheduleDatetime').value)">Schedule</button>
  </div>
</div>
<link rel="stylesheet" href="wledmega.css">
<script src="wledmega.js"></script>
