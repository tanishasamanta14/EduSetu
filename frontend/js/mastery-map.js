/* ============================================================
   EduSetu — Mastery Map JavaScript
   vis-network graph rendering, tab switching, side panel
   ============================================================ */

(function() {
  'use strict';

  var STATUS_COLORS = {
    mastered:    '#34D399',
    developing:  '#60A5FA',
    shaky:       '#FBBF24',
    weak:        '#F87171',
    unattempted: '#6B7280',
    recommended: '#A78BFA'
  };

  var STATUS_LABELS = {
    mastered: 'Mastered',
    developing: 'Developing',
    shaky: 'Shaky',
    weak: 'Weak',
    unattempted: 'Unattempted',
    recommended: 'Recommended'
  };

  var currentSubject = 'math';
  var network = null;
  var backendMapData = null;

  var graphContainer = document.getElementById('masteryGraph');
  var sidePanel = document.getElementById('sidePanel');
  var sidePanelClose = document.getElementById('sidePanelClose');
  var sidePanelContent = document.getElementById('sidePanelContent');
  var sidePanelOverlay = document.getElementById('sidePanelOverlay');
  var subjectTabs = document.getElementById('subjectTabs');

  /* ---------- Fetch Real Database Mastery Map ---------- */
  function loadBackendMap(callback) {
    fetch('/api/mastery/map', { credentials: 'include' })
      .then(function(res) {
        if (res.status === 401) {
          window.location.replace('login.html?redirect=mastery-map.html');
          return null;
        }
        return res.json();
      })
      .then(function(result) {
        if (result.success && result.data) {
          backendMapData = result.data;
        }
        if (callback) callback();
      })
      .catch(function(err) {
        console.warn('Backend mastery map load fallback:', err);
        if (callback) callback();
      });
  }

  /* ---------- Build vis-network ---------- */
  function renderGraph(subject) {
    var concepts = getMasteryConcepts(subject);
    if (!concepts || concepts.length === 0) return;

    // Sync live database mastery data from Supabase if available
    if (backendMapData && backendMapData.nodes) {
      concepts.forEach(function(c) {
        var bNode = backendMapData.nodes.find(function(n) {
          return n.id === c.id || n.topicId === c.id || (n.name && n.name.toLowerCase() === c.name.toLowerCase());
        });
        if (bNode) {
          c.status = bNode.status || c.status;
          if (bNode.confidence !== undefined) c.confidenceScore = bNode.confidence;
          if (bNode.lastScore !== null && bNode.lastScore !== undefined) c.lastScore = bNode.lastScore;
        }
      });
    }

    // Build nodes
    var nodes = [];
    var edges = [];

    concepts.forEach(function(c) {
      nodes.push({
        id: c.id,
        label: c.name,
        color: {
          background: STATUS_COLORS[c.status] || STATUS_COLORS.unattempted,
          border: STATUS_COLORS[c.status] || STATUS_COLORS.unattempted,
          highlight: {
            background: STATUS_COLORS[c.status] || STATUS_COLORS.unattempted,
            border: '#F4A300'
          },
          hover: {
            background: STATUS_COLORS[c.status] || STATUS_COLORS.unattempted,
            border: '#F4A300'
          }
        },
        size: Math.min(32, 22 + Math.max(0, c.grade - 5) * 2),
        font: {
          color: '#E5E7EB',
          size: 13,
          face: 'Inter, sans-serif',
          bold: { color: '#F9FAFB' },
          strokeWidth: 3,
          strokeColor: 'rgba(0,0,0,0.6)'
        },
        borderWidth: 2,
        borderWidthSelected: 4,
        shape: 'dot',
        shadow: {
          enabled: true,
          color: 'rgba(0,0,0,0.4)',
          size: 10,
          x: 2,
          y: 3
        },
        conceptData: c
      });

      // Build edges from prerequisites
      if (c.prerequisites) {
        c.prerequisites.forEach(function(prereq) {
          edges.push({
            from: prereq,
            to: c.id,
            arrows: { to: { enabled: true, scaleFactor: 0.6 } },
            color: { color: 'rgba(255,255,255,0.15)', highlight: 'rgba(255,255,255,0.35)', hover: 'rgba(255,255,255,0.3)' },
            width: 1.5,
            smooth: { type: 'cubicBezier', forceDirection: 'vertical', roundness: 0.4 }
          });
        });
      }
    });

    var data = {
      nodes: new vis.DataSet(nodes),
      edges: new vis.DataSet(edges)
    };

    var options = {
      layout: {
        hierarchical: {
          enabled: true,
          direction: 'UD',
          sortMethod: 'directed',
          levelSeparation: 120,
          nodeSpacing: 160,
          treeSpacing: 200
        }
      },
      physics: {
        enabled: false
      },
      interaction: {
        hover: true,
        tooltipDelay: 200,
        zoomView: true,
        dragView: true,
        navigationButtons: false
      },
      nodes: {
        chosen: {
          node: function(values) {
            values.borderWidth = 4;
            values.shadow = true;
            values.shadowSize = 15;
          }
        }
      }
    };

    // Destroy previous network
    if (network) {
      network.destroy();
    }

    network = new vis.Network(graphContainer, data, options);

    // Node click handler
    network.on('click', function(params) {
      if (params.nodes.length > 0) {
        var nodeId = params.nodes[0];
        var nodeData = data.nodes.get(nodeId);
        if (nodeData && nodeData.conceptData) {
          openSidePanel(nodeData.conceptData, concepts);
        }
      }
    });
  }

  /* ---------- Side Panel ---------- */
  function openSidePanel(concept, allConcepts) {
    sidePanelContent.replaceChildren();

    // Concept name
    var nameEl = document.createElement('h3');
    nameEl.className = 'panel-concept-name';
    nameEl.textContent = concept.name;

    // Status row
    var statusRow = document.createElement('div');
    statusRow.className = 'panel-status-row';
    var badge = document.createElement('span');
    badge.className = 'badge badge-' + concept.status;
    badge.textContent = STATUS_LABELS[concept.status] || concept.status;
    var gradeTag = document.createElement('span');
    gradeTag.className = 'badge badge-info';
    gradeTag.textContent = 'Class ' + concept.grade;
    statusRow.appendChild(badge);
    statusRow.appendChild(gradeTag);

    sidePanelContent.appendChild(nameEl);
    sidePanelContent.appendChild(statusRow);

    // Score
    if (concept.lastScore !== null && concept.lastScore !== undefined) {
      var scoreDiv = document.createElement('div');
      scoreDiv.className = 'panel-score';
      var scoreLabel = document.createElement('span');
      scoreLabel.className = 'panel-score-label';
      scoreLabel.textContent = 'Last Quiz Score';
      var scoreVal = document.createElement('span');
      scoreVal.className = 'panel-score-value';
      scoreVal.textContent = concept.lastScore + '%';
      scoreDiv.appendChild(scoreLabel);
      scoreDiv.appendChild(scoreVal);
      sidePanelContent.appendChild(scoreDiv);
    }

    // Action buttons
    var actions = document.createElement('div');
    actions.className = 'panel-actions';

    var aiBtn = document.createElement('a');
    aiBtn.className = 'btn btn-primary';
    aiBtn.href = 'chatbot.html?concept=' + encodeURIComponent(concept.id);
    aiBtn.textContent = '🤖 Ask AI to Explain';

    var quizBtn = document.createElement('a');
    quizBtn.className = 'btn btn-secondary';
    quizBtn.href = 'quiz.html?concept=' + encodeURIComponent(concept.id);
    quizBtn.textContent = '📝 Take a Quick Quiz';

    actions.appendChild(aiBtn);
    actions.appendChild(quizBtn);
    sidePanelContent.appendChild(actions);

    // Related concepts (prerequisites + dependents)
    var related = [];
    if (concept.prerequisites) {
      concept.prerequisites.forEach(function(pId) {
        var found = allConcepts.find(function(c) { return c.id === pId; });
        if (found) related.push({ concept: found, relation: 'Prerequisite' });
      });
    }
    // Find dependents
    allConcepts.forEach(function(c) {
      if (c.prerequisites && c.prerequisites.indexOf(concept.id) !== -1) {
        related.push({ concept: c, relation: 'Leads to' });
      }
    });

    if (related.length > 0) {
      var relDiv = document.createElement('div');
      relDiv.className = 'panel-related';
      var relTitle = document.createElement('h4');
      relTitle.textContent = 'Related Concepts';
      relDiv.appendChild(relTitle);

      var relList = document.createElement('div');
      relList.className = 'panel-related-list';

      related.forEach(function(r) {
        var item = document.createElement('div');
        item.className = 'panel-related-item';
        var dot = document.createElement('span');
        dot.className = 'panel-related-dot';
        dot.style.background = STATUS_COLORS[r.concept.status];
        var text = document.createElement('span');
        text.textContent = r.concept.name + ' (' + r.relation + ')';
        item.appendChild(dot);
        item.appendChild(text);
        relList.appendChild(item);
      });

      relDiv.appendChild(relList);
      sidePanelContent.appendChild(relDiv);
    }

    sidePanel.classList.add('open');
    sidePanelOverlay.classList.add('open');
  }

  function closeSidePanel() {
    sidePanel.classList.remove('open');
    sidePanelOverlay.classList.remove('open');
  }

  sidePanelClose.addEventListener('click', closeSidePanel);
  sidePanelOverlay.addEventListener('click', closeSidePanel);

  /* ---------- Tab Switching ---------- */
  subjectTabs.addEventListener('click', function(e) {
    var btn = e.target.closest('.tab-btn');
    if (!btn) return;
    var subject = btn.getAttribute('data-subject');
    if (!subject) return;

    currentSubject = subject;

    // Update active tab
    var allTabs = subjectTabs.querySelectorAll('.tab-btn');
    allTabs.forEach(function(t) {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    closeSidePanel();
    renderGraph(subject);
  });

  /* ---------- Init ---------- */
  loadBackendMap(function() {
    renderGraph('math');
  });

})();
