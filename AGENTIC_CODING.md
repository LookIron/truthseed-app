# TruthSeed PWA - Agentic Coding Guide

## Overview

Este proyecto utiliza el **AI Developer Workflow (ADW) System**, un sistema de desarrollo automatizado que permite crear, probar, revisar y desplegar features completamente aisladas mediante git worktrees y Claude Code CLI.

## Arquitectura del Sistema

```
truthseed-app/
├── adws/                        # AI Developer Workflow System
│   ├── adw_modules/             # Módulos reutilizables
│   ├── adw_triggers/            # Triggers (webhook, cron)
│   ├── adw_*.py                 # Workflow scripts
│   └── README.md                # Documentación completa
├── .claude/                     # Claude Code configuration
│   ├── settings.json            # Permisos y hooks
│   ├── commands/                # Comandos personalizados (~30)
│   └── hooks/                   # Hooks de eventos
├── scripts/                     # Shell scripts de utilidad
├── agents/                      # Output de workflows ADW
├── trees/                       # Git worktrees aislados
└── specs/                       # Especificaciones de features
```

## Comandos Principales

### Desarrollo Local

```bash
# Iniciar aplicación
/start

# Instalar dependencias
/install

# Verificar estado
/health_check

# Ejecutar tests
/test
/test_e2e

# Detener aplicación
pnpm stop_apps
```

### Planificación de Features

```bash
# Planificar una nueva feature
/feature

# Planificar un bug fix
/bug

# Planificar una tarea de mantenimiento
/chore

# Clasificar un issue
/classify_issue
```

### Implementación

```bash
# Implementar un plan existente
/implement

# Crear un patch rápido
/patch

# Revisar trabajo
/review

# Generar documentación
/document
```

### Git y GitHub

```bash
# Crear commit
/commit

# Crear pull request
/pull_request

# Generar nombre de rama
/generate_branch_name
```

## AI Developer Workflows (ADW)

### Workflows Individuales

| Workflow | Comando                            | Descripción                 |
| -------- | ---------------------------------- | --------------------------- |
| Plan     | `python3 adws/adw_plan_iso.py`     | Crea worktree y genera plan |
| Patch    | `python3 adws/adw_patch_iso.py`    | Patch rápido aislado        |
| Build    | `python3 adws/adw_build_iso.py`    | Implementa en worktree      |
| Test     | `python3 adws/adw_test_iso.py`     | Ejecuta tests aislados      |
| Review   | `python3 adws/adw_review_iso.py`   | Revisa con screenshots      |
| Document | `python3 adws/adw_document_iso.py` | Genera docs                 |
| Ship     | `python3 adws/adw_ship_iso.py`     | Aprueba y mergea PR         |

### Workflows Combinados

| Workflow                            | Descripción                  |
| ----------------------------------- | ---------------------------- |
| `adw_plan_build_iso.py`             | Plan + Build                 |
| `adw_plan_build_test_iso.py`        | Plan + Build + Test          |
| `adw_plan_build_test_review_iso.py` | Plan + Build + Test + Review |
| `adw_plan_build_review_iso.py`      | Plan + Build + Review        |
| `adw_plan_build_document_iso.py`    | Plan + Build + Document      |
| `adw_sdlc_iso.py`                   | SDLC completo                |
| `adw_sdlc_zte_iso.py`               | SDLC con auto-merge          |

### Ejemplo de Uso

```bash
# 1. Crear issue en GitHub
gh issue create --title "Add dark mode toggle" --body "..."

# 2. Ejecutar SDLC completo
python3 adws/adw_sdlc_iso.py \
  --issue-number 123 \
  --model-set opus

# 3. El sistema automáticamente:
#    - Crea worktree aislado
#    - Genera plan
#    - Implementa feature
#    - Ejecuta tests
#    - Revisa con screenshots
#    - Crea PR en GitHub
```

## Aislamiento de Worktrees

Cada workflow obtiene:

- **ADW ID único**: 8 caracteres hex (ej: `a1b2c3d4`)
- **Worktree aislado**: `trees/{adw_id}/`
- **Puerto dedicado**: 9000-9014 (soporta 15 instancias concurrentes)
- **State file**: `agents/{adw_id}/adw_state.json`

```bash
# Verificar puertos en uso
./scripts/check_ports.sh

# Limpiar worktrees antiguos
./scripts/purge_tree.sh
```

## Triggers de Automatización

### Polling (Cron)

```bash
# Monitorea issues cada 20 segundos
python3 adws/adw_triggers/trigger_cron.py \
  --workflow sdlc_zte \
  --model-set opus
```

### Webhook

```bash
# Servidor webhook en puerto 8001
python3 adws/adw_triggers/trigger_webhook.py \
  --workflow sdlc_zte \
  --model-set opus \
  --port 8001

# Exponer públicamente (cloudflare tunnel)
./scripts/expose_webhook.sh
```

## Estructura de Output

```
agents/{adw_id}/
├── adw_state.json                  # Estado del workflow
├── {adw_id}_plan_spec.md           # Plan especificación
├── planner/raw_output.jsonl        # Output del planner
├── implementor/raw_output.jsonl    # Output del implementador
├── tester/raw_output.jsonl         # Output del tester
├── reviewer/raw_output.jsonl       # Output del reviewer
└── documenter/raw_output.jsonl     # Output del documentador
```

## Model Sets

Tres conjuntos de modelos disponibles:

| Set      | Planner    | Implementor | Tester     | Reviewer   | Documentador |
| -------- | ---------- | ----------- | ---------- | ---------- | ------------ |
| `opus`   | Opus 4.6   | Opus 4.6    | Opus 4.6   | Opus 4.6   | Opus 4.6     |
| `mixed`  | Opus 4.6   | Sonnet 4.5  | Sonnet 4.5 | Sonnet 4.5 | Haiku 4.5    |
| `sonnet` | Sonnet 4.5 | Sonnet 4.5  | Sonnet 4.5 | Sonnet 4.5 | Sonnet 4.5   |

```bash
# Usar model set específico
python3 adws/adw_sdlc_iso.py \
  --issue-number 123 \
  --model-set opus
```

## Variables de Entorno

```bash
# Requeridas
ANTHROPIC_API_KEY=sk-ant-...

# Opcionales
GITHUB_PAT=ghp_...                          # Para operaciones GitHub
CLAUDE_CODE_PATH=claude                     # Path a Claude CLI
E2B_API_KEY=...                             # Agent sandbox
CLOUDFLARE_R2_*=...                         # Para uploads de screenshots
```

## Hooks de Claude Code

Los hooks se ejecutan automáticamente en eventos:

| Hook                    | Evento                        |
| ----------------------- | ----------------------------- |
| `pre_tool_use.py`       | Antes de ejecutar herramienta |
| `post_tool_use.py`      | Después de ejecutar           |
| `pre_compact.py`        | Antes de compactar sesión     |
| `user_prompt_submit.py` | Al enviar prompt              |
| `stop.py`               | Al detener sesión             |
| `subagent_stop.py`      | Al detener subagente          |
| `notification.py`       | Notificaciones                |

## Testing

### Unit Tests

```bash
# Ejecutar tests unitarios
pnpm test:unit

# Con coverage
pnpm test:coverage
```

### E2E Tests

```bash
# Ejecutar E2E tests
pnpm test:e2e

# Con UI
pnpm test:e2e:ui
```

### Tests Específicos

Comandos disponibles en `.claude/commands/e2e/`:

- `/e2e/test_basic_query` - Query básica
- `/e2e/test_complex_query` - Query compleja
- `/e2e/test_data_generation` - Generación de datos
- `/e2e/test_export_functionality` - Exportación CSV

## GitHub Integration

```bash
# Crear issue
gh issue create --title "Feature X" --body "Description"

# Ver issues
gh issue list

# Ver PR
gh pr view 123

# Mergear PR
gh pr merge 123 --squash
```

## KPIs Agentic

Track métricas del sistema:

```bash
/track_agentic_kpis
```

Métricas incluyen:

- Tiempo total de desarrollo
- Tiempo por fase
- Número de intentos
- Tests exitosos/fallidos
- Screenshots generados
- Tamaño de PR

## Troubleshooting

### Limpiar worktrees

```bash
# Limpiar todos los worktrees
./scripts/purge_tree.sh

# Verificar puertos
./scripts/check_ports.sh
```

### Detener servicios

```bash
# Detener aplicación
./scripts/stop_apps.sh

# Matar webhook
./scripts/kill_trigger_webhook.sh
```

### Debug hooks

Los hooks logean en `logs/`:

```bash
# Ver logs de hooks
tail -f logs/*.log
```

## Mejores Prácticas

1. **Usar workflows completos** (`sdlc_iso.py`) para features grandes
2. **Usar patches** (`adw_patch_iso.py`) para cambios pequeños
3. **Siempre ejecutar tests** antes de mergear
4. **Revisar screenshots** del reviewer antes de aprobar
5. **Mantener specs claros** en archivos .md
6. **Usar model set `opus`** para features críticas
7. **Usar model set `mixed`** para balance costo/calidad
8. **Verificar puertos** antes de crear nuevo worktree

## Documentación Adicional

- **ADW System**: Ver `adws/README.md` (documentación completa)
- **API Reference**: Ver `ai_docs/claude_code_cli_reference.md`
- **Comandos**: Ver archivos en `.claude/commands/`
- **Features**: Ver documentación en `app_docs/`

## Support

Para problemas o preguntas:

1. Ver documentación en `adws/README.md`
2. Revisar logs en `logs/`
3. Verificar estado con `/health_check`
4. Crear issue en GitHub

---

**Nota**: Este es un sistema avanzado de desarrollo agentic. Revisa la documentación completa en `adws/README.md` para entender todos los componentes y flujos de trabajo disponibles.
