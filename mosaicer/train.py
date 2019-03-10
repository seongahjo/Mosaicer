import argparse
import os
from datetime import datetime
import matplotlib.pyplot as plt
from keras.applications import InceptionV3, VGG16, MobileNet
from keras.callbacks import ModelCheckpoint, EarlyStopping, TensorBoard
from keras.layers import np, Dense, Dropout, GlobalAveragePooling2D
from keras.models import Model
from keras_applications.inception_v3 import preprocess_input
from keras_preprocessing.image import ImageDataGenerator

MODEL = "inceptionv3"
MODEL_SAVE_FOLDER_PATH = './model/'
model_path = MODEL_SAVE_FOLDER_PATH + 'test2.h5'
IMAGE_SIZE = (299, 299)
IMAGE_PATH = './image'
BATCH_SIZE = 10
LOG_DIRECTORY_ROOT = 'log'
STEPS_PER_EPOCH = 10
VALIDATION_STEP = 5
EPOCHS = 5
CLASSES = 2


def load_image():
    train_data_generator = ImageDataGenerator(
        preprocessing_function=preprocess_input,
        rotation_range=40,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        fill_mode='nearest')

    validation_data_generator = ImageDataGenerator(
        preprocessing_function=preprocess_input,
        rotation_range=40,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        fill_mode='nearest')

    train_generator = train_data_generator.flow_from_directory(IMAGE_PATH,
                                                               target_size=IMAGE_SIZE,
                                                               batch_size=BATCH_SIZE,
                                                               class_mode='categorical')
    validation_generator = validation_data_generator.flow_from_directory(
        IMAGE_PATH,
        target_size=IMAGE_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical')

    return (train_generator, validation_generator)


def make_model():
    if MODEL == "inceptionv3":
        base_model = InceptionV3(include_top=False, input_shape=IMAGE_SIZE + (3,))
    elif MODEL == "vgg16":
        base_model = VGG16(include_top=False, input_shape=IMAGE_SIZE + (3,))
    elif MODEL == "mobilenet":
        base_model = MobileNet(include_top=False, input_shape=IMAGE_SIZE + (3,))
    else:
        base_model = None
    x = base_model.output
    x = GlobalAveragePooling2D(name='avg_pool')(x)
    x = Dropout(0.4)(x)
    last_layer = Dense(CLASSES, activation='softmax')(x)
    model = Model(inputs=base_model.input, outputs=last_layer)
    model.compile(loss='categorical_crossentropy', optimizer='rmsprop', metrics=['accuracy'])
    model.summary()
    return model


def train():
    now = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    if not os.path.exists(MODEL_SAVE_FOLDER_PATH):
        os.mkdir(MODEL_SAVE_FOLDER_PATH)

    log_dir = "{}/run-{}/".format(LOG_DIRECTORY_ROOT, now)
    cb_checkpoint = ModelCheckpoint(filepath=model_path, monitor='val_loss', verbose=1, save_best_only=True)
    cb_early_stopping = EarlyStopping(monitor='val_loss', patience=1)
    tensorboard = TensorBoard(log_dir=log_dir, write_grads=True, write_images=True)
    model = make_model()
    generator = load_image()
    history = model.fit_generator(generator[0],
                                  validation_data=generator[1],
                                  epochs=EPOCHS,
                                  steps_per_epoch=STEPS_PER_EPOCH,
                                  validation_steps=VALIDATION_STEP,
                                  callbacks=[cb_early_stopping, cb_checkpoint, tensorboard])
    plot_training(history)


def visualize_data(positive_images, negative_images):
    figure = plt.figure()
    count = 0
    for i in range(positive_images.shape[0]):
        count += 1
        figure.add_subplot(2, positive_images.shape[0], count)
        plt.imshow((positive_images[i, :, :] * 255).astype(np.uint8))
        plt.axis('off')
        plt.title("1")

        figure.add_subplot(1, negative_images.shape[0], count)
        plt.imshow((negative_images[i, :, :] * 255).astype(np.uint8))
        plt.axis('off')
        plt.title("0")
    plt.show()


def plot_training(history):
    acc = history.history['acc']
    val_acc = history.history['val_acc']
    loss = history.history['loss']
    val_loss = history.history['val_loss']
    epochs = range(len(acc))

    plt.plot(epochs, acc, 'r.')
    plt.plot(epochs, val_acc, 'r')
    plt.title('Training and validation accuracy')

    plt.figure()
    plt.plot(epochs, loss, 'r.')
    plt.plot(epochs, val_loss, 'r-')
    plt.title('Training and validation loss')
    plt.show()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("-m", "--model", help="choose model", default="inceptionv3")
    parser.add_argument("--width", help="image width size", default=299)
    parser.add_argument("--height", help="image height size", default=299)
    parser.add_argument("-b", "--batch", help="batch size", default=10)
    parser.add_argument("-e", "--epochs", help="epochs", default=5)
    parser.add_argument("-c", "--classes", help="the number of classes", default=2)
    parser.add_argument("-i", "--image", help="image path", default="./image")
    args = parser.parse_args()
    IMAGE_SIZE = (args.width, args.height)
    BATCH_SIZE = args.batch
    EPOCHS = args.epochs
    CLASSES = args.classes
    IMAGE_PATH = args.image
    MODEL = args.model
    train()
