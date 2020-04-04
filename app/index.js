const Generator = require('yeoman-generator')
const yosay = require('yosay')
const commandExists = require('command-exists').sync

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts)
  }

  initializing() {
    this.log(yosay('Welcome to build your app'))
  }

  prompting() {
    return this.prompt([{
      type: 'input',
      name: 'appName',
      message: '请输入项目名：',
      validate: answer => {
        return answer ? true : '不能为空，请重新输入';
      }
    }]).then(answers => {
      this.answer = answers
    })
  }

  writing() {
    const templateData = {
      debug: true,
      appName: this.answer.appName
    }
    const copy = (input, output) => {
      this.fs.copy(this.templatePath(input), this.destinationPath(output))
    }
    const render = (input, output, data) => {
      this.fs.copyTpl(this.templatePath(input), this.destinationPath(output), data)
    }
    const filesToCopy = [
      { input: 'build', output: 'build' },
      { input: '.babelrc', output: '.babelrc' },
      { input: '.browserslistrc', output: '.browserslistrc' },
      { input: '.gitignore', output: '.gitignore' },
      { input: 'postcss.config.js', output: 'postcss.config.js' },
      { input: 'webpack.config.js', output: 'webpack.config.js' },
    ]
    const filesToRender = [
      { input: 'public/index.html', output: 'public/index.html' },
      { input: '_package.json', output: 'package.json' },
      { input: 'README.md', output: 'README.md' },
    ]
    filesToCopy.forEach(file => {
      copy(file.input, file.output)
    })
    filesToRender.forEach(file => {
      render(file.input, file.output, templateData)
    })
  }

  install() {
    const hasYarn = commandExists('yarn')
    this.installDependencies({
      npm: !hasYarn,
      yarn: hasYarn,
      bower: false
    })
  }
}