# 🔗 Data Processing System with Chain of Responsibility & Mediator (TypeScript)

### Домашнє завдання до Теми 11 — Поведінкові патерни Ланцюжок відповідальностей (Chain of Responsibility) та Посередник (Mediator)

## 📖 Опис проєкту

У цьому домашньому завданні реалізовано систему обробки структурованих даних у форматі JSON з використанням двох поведінкових патернів:

- 🔗 **Chain of Responsibility (Ланцюжок відповідальностей)**
- 🤝 **Mediator (Посередник)**

Застосунок зчитує записи з файлу `records.json`, виконує їхню валідацію та обробку через відповідний ланцюг обробників, після чого централізовано зберігає результати у файли різних форматів.

У випадку помилки запис не потрапляє до основного результату та зберігається окремо у файл відхилених записів.

---

## 🎯 Реалізовані можливості

✅ Завантаження записів із JSON-файлу

✅ Обробка трьох типів записів:

- `access_log`
- `transaction`
- `system_error`

✅ Валідація та трансформація даних через окремі handler-и

✅ Централізоване керування збереженням через Mediator

✅ Збереження результатів у різні формати:

- JSON
- CSV
- JSONL

✅ Логування помилкових записів

✅ Формування підсумкової статистики обробки

---

## 🔗 Патерн Chain of Responsibility

Для кожного типу запису створюється окремий ланцюг обробників.

### Access Log Chain

```text
TimestampParser
    ↓
UserIdValidator
    ↓
IpValidator
```

### Transaction Chain

```text
TimestampParser
    ↓
AmountParser
    ↓
CurrencyNormalizer
```

### System Error Chain

```text
TimestampParser
    ↓
LevelValidator
    ↓
MessageTrimmer
```

Кожен обробник виконує лише одну відповідальність та передає запис наступному елементу ланцюга.

---

## 🤝 Патерн Mediator

Клас `ProcessingMediator` виступає центральним координатором між:

- ланцюгами обробки;
- writer-класами;
- механізмом обробки помилок.

Mediator:

- приймає успішно оброблені записи;
- маршрутизує їх до потрібного writer-а;
- збирає статистику;
- обробляє відхилені записи;
- запускає фінальне збереження файлів.

---

## 📄 Формати вихідних файлів

### access_logs.json

Масив валідних записів типу `access_log`.

### transactions.csv

CSV-файл з колонками:

```csv
timestamp,amount,currency
```

### errors.jsonl

Потік JSON-об'єктів типу `system_error`.

### rejected.jsonl

Записи, які не пройшли валідацію:

```json
{
  "record": { ... },
  "error": "Validation error"
}
```

---

## 🚀 Запуск проєкту

Встановлення залежностей:

```bash
npm install
```

Запуск застосунку:

```bash
npx ts-node src/main.ts
```

---

## 📊 Приклад результату

```text
[INFO] Завантажено записів: 19
[INFO] Успішно оброблено: 9
[WARN] Відхилено з помилками: 10
[INFO] Звіт збережено у директорії src/output/
```

---

## ➕ Як додати новий тип запису

Для підтримки нового типу необхідно:

1. Створити новий тип у `DataRecord.ts`
2. Реалізувати необхідні Handler-и
3. Побудувати новий Chain
4. Створити відповідний Writer
5. Зареєструвати Writer у `ProcessingMediator`
6. Додати новий Chain у `handlerMap` у `main.ts`

Завдяки використанню патернів **Chain of Responsibility** та **Mediator** система легко розширюється без зміни вже існуючого коду.

---
## 🏗️ Структура проєкту

```text
src/
├── data/
│   └── records.json                  # Вхідний файл з необробленими записами
├── chain/
│   ├── AbstractHandler.ts           # Базовий клас для ланцюга відповідальностей
│   ├── handlers/
│   │   ├── TimestampParser.ts       # Парсинг timestamp у формат ISO
│   │   ├── UserIdValidator.ts       # Перевірка коректності userId
│   │   ├── IpValidator.ts           # Перевірка валідності IP-адреси (IPv4)
│   │   ├── AmountParser.ts          # Парсинг числових значень amount
│   │   ├── CurrencyNormalizer.ts    # Нормалізація валютного поля (ISO-формат)
│   │   ├── LevelValidator.ts        # Валідація рівня помилки (error, warning, info)
│   │   └── MessageTrimmer.ts        # Обрізання пробілів у повідомленні
│   └── chains/
│       ├── AccessLogChain.ts        # Ланцюг обробки access_log
│       ├── TransactionChain.ts      # Ланцюг обробки transaction
│       └── SystemErrorChain.ts      # Ланцюг обробки system_error
├── mediator/
│   ├── ProcessingMediator.ts        # Центральний посередник для збереження результатів
│   └── writers/
│       ├── AccessLogWriter.ts       # Збереження access_log у CSV
│       ├── TransactionWriter.ts     # Збереження transaction у JSON
│       ├── ErrorLogWriter.ts        # Збереження system_error у JSONL
│       └── RejectedWriter.ts        # Відхилені записи з помилками у JSONL
├── output/                          # Директорія для вихідних файлів
├── models/
│   └── DataRecord.ts                # Структура одного запису
└── main.ts                          # Точка входу для запуску
```