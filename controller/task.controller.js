import Task from "../models/task.model.js";
import path from "path";
import fs from "fs";

export const getTasks = async (req, res) => {
  try {
    const response = await Task.findAll();
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const getTaskById = async (req, res) => {
  try {
    const response = await Task.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const saveTask = async (req, res) => {
  try {
    if (req.files === null)
      return res.status(400).json({ message: "No File Uploaded" });

    const { title, description, status, priority, due_date } = req.body;

    const file = req.files.attachment;

    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const allowedType = [".png", ".jpg", ".jpeg", ".docx", ".txt", ".pdf"];

    if (!allowedType.includes(ext.toLowerCase()))
      return res.status(422).json({ message: "Invalid Images" });
    if (fileSize > 5000000)
      return res.status(422).json({ message: "Image must be less than 5 MB" });

    file.mv(`./public/images/${fileName}`, async (err) => {
      if (err) return res.status(500).json({ message: err.message });

      try {
        const user_id = req.userId;

        await Task.create({
          title,
          description,
          status,
          priority,
          due_date,
          attachment: fileName,
          user_id,
        });

        res
          .status(201)
          .json({ status: "success", message: "Task Created Successfully" });
      } catch (error) {
        console.log(error.message);
        res
          .status(500)
          .json({ status: "error", message: "Internal Server Error" });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

export const updateTask = async (req, res) => {
  const task = await Task.findOne({
    where: {
      id: req.params.id,
    },
  });
  if (!task) return res.status(404).json({ message: "No Data Found" });

  let fileName = "";
  if (req.files === null) {
    fileName = task.attachment;
  } else {
    const file = req.files.attachment;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    fileName = file.md5 + ext;
    const allowedType = [".png", ".jpg", ".jpeg", ".docx", ".txt", ".pdf"];

    if (!allowedType.includes(ext.toLowerCase()))
      return res.status(422).json({ message: "Invalid File" });
    if (fileSize > 5000000)
      return res.status(422).json({ message: "Image must be less than 5 MB" });

    const filepath = `./public/images/${task.attachment}`;
    fs.unlinkSync(filepath);

    file.mv(`./public/images/${fileName}`, (err) => {
      if (err) return res.status(500).json({ message: err.message });
    });
  }
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;

  try {
    const user_id = req.userId;

    await Task.update(
      {
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
        priority: req.body.priority,
        due_date: req.body.due_date,
        attachment: fileName,
        user_id: user_id,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res
      .status(200)
      .json({ status: "success", message: "Task Updated Successfuly" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!task) return res.status(404).json({ message: "No Data Found" });

    if (task.attachment) {
      const filepath = `./public/images/${task.attachment}`;
      fs.unlinkSync(filepath);
    }

    await Task.destroy({
      where: {
        id: req.params.id,
      },
    });

    res
      .status(200)
      .json({ status: "success", message: "Task Deleted Successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};
