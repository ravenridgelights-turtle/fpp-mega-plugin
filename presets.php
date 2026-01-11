<div class="container">
  <h3>Saved Presets</h3>
  <div id="presetsList">Loading presets...</div>
  <div style="margin-top:10px;">
    <input type="text" id="presetName" placeholder="Preset Name">
    <input type="text" id="presetModel" placeholder="Model ID">
    <input type="text" id="presetEffect" placeholder="Effect Name">
    <button onclick="savePreset(document.getElementById('presetName').value, document.getElementById('presetModel').value, document.getElementById('presetEffect').value)">Save Preset</button>
  </div>
</div>
<link rel="stylesheet" href="wledmega.css">
<script src="wledmega.js"></script>
