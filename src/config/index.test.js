import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// We need to test with different env configurations, so we'll use dynamic imports
describe("config/index.js", () => {
  describe("getStorageKey", () => {
    it("should prefix key with storage prefix", async () => {
      const { getStorageKey, STORAGE_PREFIX } = await import("./index.js");

      const result = getStorageKey("testKey");
      expect(result).toBe(`${STORAGE_PREFIX}testKey`);
    });

    it("should handle empty string key", async () => {
      const { getStorageKey, STORAGE_PREFIX } = await import("./index.js");

      const result = getStorageKey("");
      expect(result).toBe(STORAGE_PREFIX);
    });

    it("should handle keys with special characters", async () => {
      const { getStorageKey, STORAGE_PREFIX } = await import("./index.js");

      const result = getStorageKey("test-key_123");
      expect(result).toBe(`${STORAGE_PREFIX}test-key_123`);
    });

    it("should handle keys with spaces", async () => {
      const { getStorageKey, STORAGE_PREFIX } = await import("./index.js");

      const result = getStorageKey("test key");
      expect(result).toBe(`${STORAGE_PREFIX}test key`);
    });
  });

  describe("debugLog", () => {
    let consoleSpy;

    beforeEach(() => {
      consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    it("should be a function", async () => {
      const { debugLog } = await import("./index.js");
      expect(typeof debugLog).toBe("function");
    });

    it("should not throw when called with no arguments", async () => {
      const { debugLog } = await import("./index.js");
      expect(() => debugLog()).not.toThrow();
    });

    it("should not throw when called with multiple arguments", async () => {
      const { debugLog } = await import("./index.js");
      expect(() => debugLog("test", 123, { key: "value" })).not.toThrow();
    });

    it("should accept any type of argument", async () => {
      const { debugLog } = await import("./index.js");

      expect(() => debugLog("string")).not.toThrow();
      expect(() => debugLog(123)).not.toThrow();
      expect(() => debugLog(null)).not.toThrow();
      expect(() => debugLog(undefined)).not.toThrow();
      expect(() => debugLog({ obj: true })).not.toThrow();
      expect(() => debugLog([1, 2, 3])).not.toThrow();
    });
  });

  describe("STORAGE_KEYS", () => {
    it("should have BRICKRUSH_HIGH_SCORE key", async () => {
      const { STORAGE_KEYS } = await import("./index.js");

      expect(STORAGE_KEYS).toHaveProperty("BRICKRUSH_HIGH_SCORE");
      expect(typeof STORAGE_KEYS.BRICKRUSH_HIGH_SCORE).toBe("string");
    });

    it("should have GAME_1024_BEST_SCORE key", async () => {
      const { STORAGE_KEYS } = await import("./index.js");

      expect(STORAGE_KEYS).toHaveProperty("GAME_1024_BEST_SCORE");
      expect(typeof STORAGE_KEYS.GAME_1024_BEST_SCORE).toBe("string");
    });

    it("should have SNAKE_HIGH_SCORE key", async () => {
      const { STORAGE_KEYS } = await import("./index.js");

      expect(STORAGE_KEYS).toHaveProperty("SNAKE_HIGH_SCORE");
      expect(typeof STORAGE_KEYS.SNAKE_HIGH_SCORE).toBe("string");
    });

    it("should have keys prefixed with storage prefix", async () => {
      const { STORAGE_KEYS, STORAGE_PREFIX } = await import("./index.js");

      expect(STORAGE_KEYS.BRICKRUSH_HIGH_SCORE).toContain(STORAGE_PREFIX);
      expect(STORAGE_KEYS.GAME_1024_BEST_SCORE).toContain(STORAGE_PREFIX);
      expect(STORAGE_KEYS.SNAKE_HIGH_SCORE).toContain(STORAGE_PREFIX);
    });

    it("should have unique keys for each game", async () => {
      const { STORAGE_KEYS } = await import("./index.js");

      const keys = Object.values(STORAGE_KEYS);
      const uniqueKeys = new Set(keys);
      expect(uniqueKeys.size).toBe(keys.length);
    });
  });

  describe("APP_NAME", () => {
    it("should be a string", async () => {
      const { APP_NAME } = await import("./index.js");
      expect(typeof APP_NAME).toBe("string");
    });

    it("should have a default value", async () => {
      const { APP_NAME } = await import("./index.js");
      expect(APP_NAME.length).toBeGreaterThan(0);
    });
  });

  describe("APP_VERSION", () => {
    it("should be a string", async () => {
      const { APP_VERSION } = await import("./index.js");
      expect(typeof APP_VERSION).toBe("string");
    });

    it("should have a default value", async () => {
      const { APP_VERSION } = await import("./index.js");
      expect(APP_VERSION.length).toBeGreaterThan(0);
    });

    it("should follow semver format", async () => {
      const { APP_VERSION } = await import("./index.js");
      // Basic semver regex pattern
      const semverPattern = /^\d+\.\d+\.\d+/;
      expect(APP_VERSION).toMatch(semverPattern);
    });
  });

  describe("STORAGE_PREFIX", () => {
    it("should be a string", async () => {
      const { STORAGE_PREFIX } = await import("./index.js");
      expect(typeof STORAGE_PREFIX).toBe("string");
    });

    it("should have a default value", async () => {
      const { STORAGE_PREFIX } = await import("./index.js");
      expect(STORAGE_PREFIX.length).toBeGreaterThan(0);
    });

    it("should end with underscore for clean key separation", async () => {
      const { STORAGE_PREFIX } = await import("./index.js");
      expect(STORAGE_PREFIX.endsWith("_")).toBe(true);
    });
  });

  describe("DEBUG_MODE", () => {
    it("should be a boolean", async () => {
      const { DEBUG_MODE } = await import("./index.js");
      expect(typeof DEBUG_MODE).toBe("boolean");
    });
  });

  describe("default export", () => {
    it("should export an object", async () => {
      const config = await import("./index.js");
      expect(typeof config.default).toBe("object");
    });

    it("should contain APP_NAME", async () => {
      const config = await import("./index.js");
      expect(config.default).toHaveProperty("APP_NAME");
      expect(config.default.APP_NAME).toBe(config.APP_NAME);
    });

    it("should contain APP_VERSION", async () => {
      const config = await import("./index.js");
      expect(config.default).toHaveProperty("APP_VERSION");
      expect(config.default.APP_VERSION).toBe(config.APP_VERSION);
    });

    it("should contain STORAGE_PREFIX", async () => {
      const config = await import("./index.js");
      expect(config.default).toHaveProperty("STORAGE_PREFIX");
      expect(config.default.STORAGE_PREFIX).toBe(config.STORAGE_PREFIX);
    });

    it("should contain DEBUG_MODE", async () => {
      const config = await import("./index.js");
      expect(config.default).toHaveProperty("DEBUG_MODE");
      expect(config.default.DEBUG_MODE).toBe(config.DEBUG_MODE);
    });

    it("should contain STORAGE_KEYS", async () => {
      const config = await import("./index.js");
      expect(config.default).toHaveProperty("STORAGE_KEYS");
      expect(config.default.STORAGE_KEYS).toBe(config.STORAGE_KEYS);
    });

    it("should contain getStorageKey function", async () => {
      const config = await import("./index.js");
      expect(config.default).toHaveProperty("getStorageKey");
      expect(typeof config.default.getStorageKey).toBe("function");
    });

    it("should contain debugLog function", async () => {
      const config = await import("./index.js");
      expect(config.default).toHaveProperty("debugLog");
      expect(typeof config.default.debugLog).toBe("function");
    });
  });

  describe("integration", () => {
    it("STORAGE_KEYS values should be generated using getStorageKey", async () => {
      const { STORAGE_KEYS, getStorageKey } = await import("./index.js");

      // The keys should match what getStorageKey would produce
      expect(STORAGE_KEYS.BRICKRUSH_HIGH_SCORE).toBe(
        getStorageKey("brickrushHighScore"),
      );
      expect(STORAGE_KEYS.GAME_1024_BEST_SCORE).toBe(
        getStorageKey("game1024BestScore"),
      );
      expect(STORAGE_KEYS.SNAKE_HIGH_SCORE).toBe(
        getStorageKey("snakeHighScore"),
      );
    });

    it("all exported values should be consistent", async () => {
      const config = await import("./index.js");

      // Verify named exports match default export
      expect(config.APP_NAME).toBe(config.default.APP_NAME);
      expect(config.APP_VERSION).toBe(config.default.APP_VERSION);
      expect(config.STORAGE_PREFIX).toBe(config.default.STORAGE_PREFIX);
      expect(config.DEBUG_MODE).toBe(config.default.DEBUG_MODE);
      expect(config.STORAGE_KEYS).toBe(config.default.STORAGE_KEYS);
      expect(config.getStorageKey).toBe(config.default.getStorageKey);
      expect(config.debugLog).toBe(config.default.debugLog);
    });
  });
});
