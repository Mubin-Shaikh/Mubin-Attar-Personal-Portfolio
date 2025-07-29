import asyncio
import random
import math  # <--- ADD THIS IMPORT
from pyscript import document, window
from pyodide.ffi import create_proxy
from js import getHighScore, setHighScore

# --- DOM Elements ---
game_container = document.getElementById("game-container")
canvas = document.getElementById("snake-canvas")
ctx = canvas.getContext("2d")
instructions_el = document.getElementById("game-instructions")

game_over_el = document.getElementById("game-over-screen")
paused_el = document.getElementById("game-paused-screen")
restart_button = document.getElementById("restart-button")
score_el = document.getElementById("score")
final_score_el = document.getElementById("final-score")
ingame_score_display = document.getElementById("ingame-score-display")
loading_message = document.getElementById("loading-message")
game_controls = document.getElementById("game-controls")
high_score_instructions_el = document.getElementById("high-score-instructions")
high_score_ingame_el = document.getElementById("high-score-ingame")
new_high_score_message_el = document.getElementById("new-high-score-message")
start_sound = document.getElementById("start-sound")
eat_sound = document.getElementById("eat-sound")
gameover_sound = document.getElementById("gameover-sound")
# Mobile Buttons
up_btn = document.getElementById("up-btn")
down_btn = document.getElementById("down-btn")
left_btn = document.getElementById("left-btn")
right_btn = document.getElementById("right-btn")
action_btn = document.getElementById("action-btn")
action_btn_icon = document.getElementById("action-btn-icon")

# --- Game Theming and Configuration ---
THEME_COLORS = {
    "background": "#171717",
    "food": "#4ade80",
    "powerup_food": "#FFD43B",
    "snake_head": "#FFD43B",
    "snake_body": "#4B8BBE",
    "snake_eye": "#171717",
}
GameState = {
    "INSTRUCTIONS": "instructions",
    "RUNNING": "running",
    "PAUSED": "paused",
    "GAMEOVER": "gameover",
}
TILE_SIZE = 20

# --- Global Game State Variables ---
tile_count_x, tile_count_y = 0, 0
game_state, high_score = None, 0
snake, food, powerup_food, direction = [], {}, None, {}
score, game_speed, pulse_counter = 0, 0, 0 # <--- ADD pulse_counter


# --- Main Functions ---
def set_canvas_size(e=None):
    global tile_count_x, tile_count_y
    container = canvas.parentElement
    style = window.getComputedStyle(container)
    container_width = container.clientWidth - (
        int(style.paddingLeft.replace("px", ""))
        + int(style.paddingRight.replace("px", ""))
    )
    tile_count_x = container_width // TILE_SIZE
    aspect_ratio = 3 / 4 if window.innerWidth < 640 else 1 / 2
    tile_count_y = int(tile_count_x * aspect_ratio)
    canvas.width = tile_count_x * TILE_SIZE
    canvas.height = tile_count_y * TILE_SIZE
    if game_state:
        reset_game()
        draw()


def reset_game(e=None):
    global snake, food, direction, score, game_speed, high_score, pulse_counter
    pulse_counter = 0 # <--- ADD THIS LINE
    high_score = getHighScore()
    high_score_instructions_el.textContent = high_score
    high_score_ingame_el.textContent = high_score
    start_x, start_y = tile_count_x // 2, tile_count_y // 2
    snake = [
        {"x": start_x, "y": start_y},
        {"x": start_x - 1, "y": start_y},
        {"x": start_x - 2, "y": start_y},
    ]
    spawn_food()
    direction = {"x": 0, "y": 0}
    score = 0
    game_speed = 150
    update_ui(GameState["INSTRUCTIONS"])
    draw()


async def game_loop():
    while True:
        if game_state == GameState["RUNNING"]:
            update()
            draw()
        await asyncio.sleep(game_speed / 1000.0)


def update():
    global score, game_speed, high_score
    if direction["x"] == 0 and direction["y"] == 0:
        return
    head = {
        "x": snake[0]["x"] + direction["x"],
        "y": snake[0]["y"] + direction["y"],
    }

    # Wall collision and tunnel logic
    cy1, cy2 = (tile_count_y // 2) - 1, tile_count_y // 2
    cx1, cx2 = (tile_count_x // 2) - 1, tile_count_x // 2
    if head["x"] < 0:
        head["x"] = tile_count_x - 1 if head["y"] in (cy1, cy2) else -1
    elif head["x"] >= tile_count_x:
        head["x"] = 0 if head["y"] in (cy1, cy2) else tile_count_x
    if head["y"] < 0:
        head["y"] = tile_count_y - 1 if head["x"] in (cx1, cx2) else -1
    elif head["y"] >= tile_count_y:
        head["y"] = 0 if head["x"] in (cx1, cx2) else tile_count_y

    # Self-collision and game over logic
    if not (0 <= head["x"] < tile_count_x and 0 <= head["y"] < tile_count_y) or any(
        s["x"] == head["x"] and s["y"] == head["y"] for s in snake[1:]
    ):
        if score > high_score:
            high_score = score
            setHighScore(high_score)
            new_high_score_message_el.classList.remove("hidden")
        gameover_sound.play()
        game_container.classList.add("shake")

        async def remove_shake():
            await asyncio.sleep(0.3)
            game_container.classList.remove("shake")

        asyncio.ensure_future(remove_shake())
        return update_ui(GameState["GAMEOVER"])

    snake.insert(0, head)

    # Check for eating food or power-up
    ate_something = False
    if food and head["x"] == food["x"] and head["y"] == food["y"]:
        score += 1
        ate_something = True
    elif (
        powerup_food
        and head["x"] == powerup_food["x"]
        and head["y"] == powerup_food["y"]
    ):
        score += 5  # More points for power-up
        if game_speed > 60:
            game_speed -= 20  # Temporarily increase speed
        ate_something = True

    if ate_something:
        eat_sound.play()
        score_el.textContent = score
        spawn_food()
        if score % 5 == 0 and game_speed > 60:
            game_speed -= 10
    else:
        snake.pop()


def draw():
    ctx.fillStyle = THEME_COLORS["background"]
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    draw_tunnels()
    draw_food()
    draw_snake()


def draw_tunnels():
    ctx.fillStyle = "#27272a"
    cy1, cy2 = (tile_count_y // 2) - 1, tile_count_y // 2
    cx1, cx2 = (tile_count_x // 2) - 1, tile_count_x // 2
    ctx.fillRect(0, cy1 * TILE_SIZE, TILE_SIZE, TILE_SIZE * 2)
    ctx.fillRect(
        (tile_count_x - 1) * TILE_SIZE, cy1 * TILE_SIZE, TILE_SIZE, TILE_SIZE * 2
    )
    ctx.fillRect(cx1 * TILE_SIZE, 0, TILE_SIZE * 2, TILE_SIZE)
    ctx.fillRect(
        cx1 * TILE_SIZE, (tile_count_y - 1) * TILE_SIZE, TILE_SIZE * 2, TILE_SIZE
    )


def draw_food():
    global pulse_counter
    # Always reset shadow properties at the start to avoid affecting other drawings
    ctx.shadowBlur = 0
    ctx.shadowColor = "transparent"

    if food: # Draw regular food
        ctx.fillStyle = THEME_COLORS["food"]
        ctx.beginPath()
        ctx.arc(
            food["x"] * TILE_SIZE + TILE_SIZE / 2,
            food["y"] * TILE_SIZE + TILE_SIZE / 2,
            TILE_SIZE / 2.5, 0, 2 * math.pi
        )
        ctx.fill()

    elif powerup_food: # Draw glowing power-up food
        pulse_counter += 1
        # Create a smooth pulse using a sine wave
        blur_amount = 15 + (math.sin(pulse_counter * 0.15) * 10)
        
        # Apply the glow effect BEFORE drawing
        ctx.shadowBlur = blur_amount
        ctx.shadowColor = THEME_COLORS["powerup_food"]
        
        # Draw the power-up circle
        ctx.fillStyle = THEME_COLORS["powerup_food"]
        ctx.beginPath()
        ctx.arc(
            powerup_food["x"] * TILE_SIZE + TILE_SIZE / 2,
            powerup_food["y"] * TILE_SIZE + TILE_SIZE / 2,
            TILE_SIZE / 2.2, 0, 2 * math.pi
        )
        ctx.fill()
        
        # Reset shadow properties AGAIN after drawing to be extra safe
        ctx.shadowBlur = 0
        ctx.shadowColor = "transparent"


def draw_snake():
    for i, segment in enumerate(snake):
        ctx.fillStyle = (
            THEME_COLORS["snake_head"]
            if i == 0
            else (
                THEME_COLORS["snake_body"] if i % 2 != 0 else THEME_COLORS["snake_head"]
            )
        )
        ctx.beginPath()
        ctx.roundRect(
            segment["x"] * TILE_SIZE,
            segment["y"] * TILE_SIZE,
            TILE_SIZE,
            TILE_SIZE,
            [TILE_SIZE / 4],
        )
        ctx.fill()
    head = snake[0]
    eye_size = TILE_SIZE / 5
    ctx.fillStyle = THEME_COLORS["snake_eye"]
    eye_dir = (
        direction
        if not (direction["x"] == 0 and direction["y"] == 0)
        else {"x": 1, "y": 0}
    )
    if eye_dir["x"] == 1:
        ctx.fillRect(
            head["x"] * TILE_SIZE + TILE_SIZE / 2,
            head["y"] * TILE_SIZE + eye_size,
            eye_size,
            eye_size,
        )
        ctx.fillRect(
            head["x"] * TILE_SIZE + TILE_SIZE / 2,
            head["y"] * TILE_SIZE + 3 * eye_size,
            eye_size,
            eye_size,
        )
    elif eye_dir["x"] == -1:
        ctx.fillRect(
            head["x"] * TILE_SIZE + eye_size,
            head["y"] * TILE_SIZE + eye_size,
            eye_size,
            eye_size,
        )
        ctx.fillRect(
            head["x"] * TILE_SIZE + eye_size,
            head["y"] * TILE_SIZE + 3 * eye_size,
            eye_size,
            eye_size,
        )
    elif eye_dir["y"] == 1:
        ctx.fillRect(
            head["x"] * TILE_SIZE + eye_size,
            head["y"] * TILE_SIZE + TILE_SIZE / 2,
            eye_size,
            eye_size,
        )
        ctx.fillRect(
            head["x"] * TILE_SIZE + 3 * eye_size,
            head["y"] * TILE_SIZE + TILE_SIZE / 2,
            eye_size,
            eye_size,
        )
    elif eye_dir["y"] == -1:
        ctx.fillRect(
            head["x"] * TILE_SIZE + eye_size,
            head["y"] * TILE_SIZE + eye_size,
            eye_size,
            eye_size,
        )
        ctx.fillRect(
            head["x"] * TILE_SIZE + 3 * eye_size,
            head["y"] * TILE_SIZE + eye_size,
            eye_size,
            eye_size,
        )


def spawn_food():
    global food, powerup_food
    powerup_food = None

    if random.randint(1, 5) == 1:  # 1 in 5 chance for a power-up
        while True:
            powerup_food = {
                "x": random.randint(0, tile_count_x - 1),
                "y": random.randint(0, tile_count_y - 1),
            }
            if not any(
                s["x"] == powerup_food["x"] and s["y"] == powerup_food["y"]
                for s in snake
            ):
                food = {}  # Clear regular food
                break
    else:
        while True:
            food = {
                "x": random.randint(0, tile_count_x - 1),
                "y": random.randint(0, tile_count_y - 1),
            }
            if not any(s["x"] == food["x"] and s["y"] == food["y"] for s in snake):
                break


def update_ui(new_state):
    global game_state, score
    game_state = new_state
    for el in [
        instructions_el,
        game_over_el,
        paused_el,
        ingame_score_display,
        new_high_score_message_el,
    ]:
        el.classList.add("hidden")
    action_btn_icon.className = "fas fa-play"  # Default icon
    if new_state == GameState["INSTRUCTIONS"]:
        instructions_el.classList.remove("hidden")
    elif new_state == GameState["RUNNING"]:
        ingame_score_display.classList.remove("hidden")
        score_el.textContent = score
        action_btn_icon.className = "fas fa-pause"  # Change to pause icon
    elif new_state == GameState["PAUSED"]:
        paused_el.classList.remove("hidden")
    elif new_state == GameState["GAMEOVER"]:
        game_over_el.classList.remove("hidden")
        final_score_el.textContent = score
        action_btn_icon.className = "fas fa-sync-alt"  # Change to restart icon


def set_direction(dx, dy):
    global direction, game_state
    # This prevents the snake from moving backwards on itself.
    is_moving = direction["x"] != 0 or direction["y"] != 0
    if is_moving and dx == -direction["x"] and dy == -direction["y"]:
        return  # Ignore the input if it's the opposite direction

    if game_state in [GameState["PAUSED"], GameState["INSTRUCTIONS"]]:
        update_ui(GameState["RUNNING"])

    if game_state != GameState["RUNNING"]:
        return

    direction = {"x": dx, "y": dy}


# --- Event Handling ---
def handle_action_btn_click(e):
    e.preventDefault()
    if game_state in [GameState["INSTRUCTIONS"], GameState["GAMEOVER"]]:
        start_sound.play()
        reset_game()
        update_ui(GameState["RUNNING"])
    elif game_state == GameState["RUNNING"]:
        update_ui(GameState["PAUSED"])
    elif game_state == GameState["PAUSED"]:
        update_ui(GameState["RUNNING"])


def handle_keydown(e):
    # Check if event has 'key' attribute
    if not hasattr(e, "key"):
        return
    # Ignore keydown events if focus is on input or textarea elements
    target = e.target
    tag_name = target.tagName if hasattr(target, "tagName") else ""
    if tag_name in ["INPUT", "TEXTAREA"]:
        return

    key, code = e.key, e.code

    if code == "Enter":
        e.preventDefault()
        if game_state in [GameState["INSTRUCTIONS"], GameState["GAMEOVER"]]:
            start_sound.play()
            reset_game()
            update_ui(GameState["RUNNING"])
        return

    if code == "Space":
        e.preventDefault()
        if game_state == GameState["RUNNING"]:
            update_ui(GameState["PAUSED"])
        elif game_state == GameState["PAUSED"]:
            update_ui(GameState["RUNNING"])
        return

    if key in ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]:
        e.preventDefault()
        key_map = {
            "ArrowUp": (0, -1),
            "ArrowDown": (0, 1),
            "ArrowLeft": (-1, 0),
            "ArrowRight": (1, 0),
        }
        new_dir = key_map[key]
        set_direction(new_dir[0], new_dir[1])


def main():
    loading_message.classList.add("hidden")
    game_controls.classList.remove("hidden")

    document.addEventListener("keydown", create_proxy(handle_keydown))
    restart_button.addEventListener("click", create_proxy(reset_game))
    window.addEventListener("resize", create_proxy(set_canvas_size))
    # Mobile button listeners
    up_btn.addEventListener("click", create_proxy(lambda e: set_direction(0, -1)))
    down_btn.addEventListener("click", create_proxy(lambda e: set_direction(0, 1)))
    left_btn.addEventListener("click", create_proxy(lambda e: set_direction(-1, 0)))
    right_btn.addEventListener("click", create_proxy(lambda e: set_direction(1, 0)))
    action_btn.addEventListener("click", create_proxy(handle_action_btn_click))

    set_canvas_size()
    reset_game()
    draw()
    asyncio.ensure_future(game_loop())


main()
