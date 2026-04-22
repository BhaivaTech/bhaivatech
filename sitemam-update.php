<?php
/**
 * =====================================================
 *  SITEMAP AUTO-UPDATER — LOCAL TEST (swaragh-live)
 * =====================================================
 *  TEST COPY: Paths point to swaragh-live-30-09-2025
 *  Run via browser:
 *    http://localhost/chethan/swaragh-live-30-09-2025/update_sitemap.php?key=swaragh2026auto
 * =====================================================
 */

// ─── CONFIG (LOCAL TEST PATHS) ────────────────────────
define('SECRET_KEY', 'BhaivaTechauto2026');
define('SITEMAP_FILE', __DIR__ . '/sitemap.xml');
define('WEB_ROOT', __DIR__);
define('TIMEZONE', 'Asia/Kolkata');
define('LOG_FILE', __DIR__ . '/sitemap_update.log');
define('LOG_RETAIN_DAYS', 5);
define('BACKUP_DIR', __DIR__ . '/sitemap_backups');
define('BACKUP_RETAIN_DAYS', 5);

// ─── SPECIAL URL-TO-FILE OVERRIDES ───────────────────
$URL_MAP_OVERRIDES = [
    '/'                  => 'index.shtml',        // or index.php
    '/about'             => 'about.shtml',
    '/services'          => 'services.shtml',
    '/contact'           => 'contact.shtml',
    '/project'         => 'project.shtml',
    // add all your pages here
];

// ─── BOOTSTRAP ────────────────────────────────────────
date_default_timezone_set(TIMEZONE);
$isCron = in_array('--cron', $argv ?? []);
$isWeb = !$isCron;
$startTime = microtime(true);

if ($isWeb) {
    $providedKey = $_GET['key'] ?? '';
    if ($providedKey !== SECRET_KEY) {
        http_response_code(403);
        die('403 Forbidden. Add ?key=swaragh2026auto to the URL.');
    }
    header('Content-Type: text/html; charset=utf-8');
    echo '<!DOCTYPE html><html><head>
    <meta charset="utf-8">
    <title>Sitemap Updater — LOCAL TEST · swaragh-live</title>
    <style>
      body{font-family:monospace;background:#0f172a;color:#e2e8f0;padding:30px;font-size:13px;line-height:1.6}
      h1{color:#38bdf8;margin-bottom:4px;font-size:18px}
      .subtitle{color:#64748b;font-size:11px;margin-bottom:20px}
      .ok{color:#4ade80} .warn{color:#facc15} .err{color:#f87171} .info{color:#94a3b8}
      .box{background:#1e293b;padding:16px 20px;border-radius:8px;margin:10px 0;border-left:4px solid #3b82f6}
      .box.green{border-color:#22c55e} .box.yellow{border-color:#f59e0b}
      .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:20px 0}
      .card{background:#1e293b;border-radius:8px;padding:14px;text-align:center}
      .card .num{font-size:26px;font-weight:700;line-height:1}
      .card .lbl{font-size:10px;color:#64748b;text-transform:uppercase;margin-top:4px;letter-spacing:.5px}
      table{width:100%;border-collapse:collapse;margin-top:20px;font-size:12px}
      th{background:#1e3a5f;padding:8px 12px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:.5px;color:#93c5fd;position:sticky;top:0}
      td{padding:7px 12px;border-bottom:1px solid #1e293b}
      tr:hover td{background:#1e293b}
      .badge{padding:2px 8px;border-radius:99px;font-size:10px;font-weight:600}
      .b-up{background:#1e3a5f;color:#60a5fa}
      .b-same{background:#1e293b;color:#475569}
      .b-miss{background:#451a03;color:#fbbf24}
    </style></head><body>';
    echo '<h1>🔄 Sitemap Auto-Updater</h1>';
    echo '<div class="subtitle">⚠️ LOCAL TEST MODE &nbsp;·&nbsp; swaragh-live-30-09-2025 &nbsp;·&nbsp; ' . date('d M Y H:i:s') . ' IST</div>';
}

// ─── HELPERS ──────────────────────────────────────────
function log_msg($msg, $type = 'info')
{
    global $isCron;
    $line = '[' . date('Y-m-d H:i:s') . "] [$type] $msg";
    if ($isCron)
        echo $line . PHP_EOL;
    file_put_contents(LOG_FILE, $line . PHP_EOL, FILE_APPEND);
}

function trim_log()
{
    if (!file_exists(LOG_FILE))
        return;
    $cutoff = strtotime('-' . LOG_RETAIN_DAYS . ' days');
    $lines = file(LOG_FILE, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $filtered = array_filter($lines, function ($line) use ($cutoff) {
        if (preg_match('/^\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\]/', $line, $m)) {
            return strtotime($m[1]) >= $cutoff;
        }
        return true;
    });
    file_put_contents(LOG_FILE, implode(PHP_EOL, $filtered) . PHP_EOL);
}

function trim_backups()
{
    if (!is_dir(BACKUP_DIR))
        return;
    $cutoff = strtotime('-' . BACKUP_RETAIN_DAYS . ' days');
    foreach (glob(BACKUP_DIR . '/sitemap_*.xml') as $file) {
        if (filemtime($file) < $cutoff)
            unlink($file);
    }
}

function resolve_file($urlPath)
{
    global $URL_MAP_OVERRIDES;
    if (isset($URL_MAP_OVERRIDES[$urlPath])) {
        return $URL_MAP_OVERRIDES[$urlPath];
    }
    $slug = ltrim($urlPath, '/');
    foreach (['.shtml', '.html', '.php', ''] as $ext) {
        $candidate = $slug . $ext;
        if (file_exists(WEB_ROOT . '/' . $candidate))
            return $candidate;
    }
    return null;
}

function get_file_lastmod($filename)
{
    $path = WEB_ROOT . '/' . $filename;
    if (!file_exists($path))
        return null;
    return date('Y-m-d\TH:i:sP', filemtime($path));
}

function backup_sitemap()
{
    if (!is_dir(BACKUP_DIR))
        mkdir(BACKUP_DIR, 0755, true);
    $dest = BACKUP_DIR . '/sitemap_' . date('Y-m-d_H-i-s') . '.xml';
    copy(SITEMAP_FILE, $dest);
    return $dest;
}

// ─── MAIN PROCESS ─────────────────────────────────────
if (!file_exists(SITEMAP_FILE)) {
    die('ERROR: sitemap.xml not found at ' . SITEMAP_FILE);
}

$backupPath = backup_sitemap();
log_msg("Backup created: $backupPath");

$xml = simplexml_load_file(SITEMAP_FILE);
if (!$xml)
    die('ERROR: Could not parse sitemap.xml');

$stats = ['total' => 0, 'updated' => 0, 'same' => 0, 'missing' => 0, 'changes' => []];

foreach ($xml->url as $entry) {
    $stats['total']++;
    $loc = (string) $entry->loc;
    $urlPath = parse_url($loc, PHP_URL_PATH) ?: '/';

    $filename = resolve_file($urlPath);

    if (!$filename) {
        $stats['missing']++;
        $stats['changes'][] = ['url' => $urlPath, 'file' => '—', 'old' => (string) ($entry->lastmod ?? ''), 'new' => '—', 'status' => 'missing'];
        log_msg("FILE NOT FOUND: $urlPath", 'WARN');
        continue;
    }

    $newLastmod = get_file_lastmod($filename);
    $oldLastmod = isset($entry->lastmod) ? (string) $entry->lastmod : '';
    $oldDate = substr($oldLastmod, 0, 10);
    $newDate = substr($newLastmod, 0, 10);

    if ($oldDate === $newDate) {
        $stats['same']++;
        $stats['changes'][] = ['url' => $urlPath, 'file' => $filename, 'old' => $oldLastmod, 'new' => $newLastmod, 'status' => 'same'];
    } else {
        $entry->lastmod = $newLastmod;
        $stats['updated']++;
        $stats['changes'][] = ['url' => $urlPath, 'file' => $filename, 'old' => $oldLastmod, 'new' => $newLastmod, 'status' => 'updated'];
        log_msg("UPDATED: $urlPath → $newLastmod (was: $oldLastmod)");
    }
}

// Save
$dom = new DOMDocument('1.0', 'UTF-8');
$dom->preserveWhiteSpace = false;
$dom->formatOutput = true;
$dom->loadXML($xml->asXML());
file_put_contents(SITEMAP_FILE, $dom->saveXML());

if ($stats['updated'] > 0 || $stats['missing'] > 0) {
    log_msg("DONE — Updated: {$stats['updated']}, Skipped: {$stats['same']}, Missing: {$stats['missing']}");
} else {
    log_msg("RAN — No changes. All {$stats['same']} URLs already up to date.");
}

trim_log();
trim_backups();

$elapsed = round(microtime(true) - $startTime, 2);

// ─── WEB OUTPUT ───────────────────────────────────────
if ($isWeb) {
    echo "<div class='box green'>";
    echo "<span class='ok'>✅ Done in {$elapsed}s</span> &nbsp;·&nbsp; ";
    echo "<span class='info'>📦 Backup: " . basename($backupPath) . "</span>";
    echo "</div>";

    echo "<div class='grid'>";
    $cards = [
        ['#38bdf8', $stats['total'], 'Total URLs'],
        ['#4ade80', $stats['updated'], '✅ Updated'],
        ['#475569', $stats['same'], '🔵 No Change'],
        ['#facc15', $stats['missing'], '⚠️ Missing File'],
    ];
    foreach ($cards as [$col, $val, $lbl]) {
        echo "<div class='card' style='border-top:3px solid $col'>";
        echo "<div class='num' style='color:$col'>$val</div>";
        echo "<div class='lbl'>$lbl</div></div>";
    }
    echo "</div>";

    echo "<table><thead><tr><th>#</th><th>URL</th><th>File on Disk</th><th>Old lastmod</th><th>New lastmod (filemtime)</th><th>Status</th></tr></thead><tbody>";
    $i = 1;
    foreach ($stats['changes'] as $ch) {
        $badge = match ($ch['status']) {
            'updated' => "<span class='badge b-up'>Updated</span>",
            'same' => "<span class='badge b-same'>No change</span>",
            'missing' => "<span class='badge b-miss'>File missing</span>",
            default => ''
        };
        $oldStyle = $ch['status'] === 'updated' ? "style='color:#f87171;text-decoration:line-through'" : "style='color:#64748b'";
        $newStyle = $ch['status'] === 'updated' ? "style='color:#4ade80;font-weight:600'" : "style='color:#475569'";
        echo "<tr>";
        echo "<td style='color:#475569'>$i</td>";
        echo "<td style='color:#7dd3fc'>{$ch['url']}</td>";
        echo "<td style='color:#a78bfa;font-size:11px'>{$ch['file']}</td>";
        echo "<td $oldStyle style='font-size:11px'>{$ch['old']}</td>";
        echo "<td $newStyle style='font-size:11px'>{$ch['new']}</td>";
        echo "<td>$badge</td>";
        echo "</tr>";
        $i++;
    }
    echo "</tbody></table></body></html>";
}
